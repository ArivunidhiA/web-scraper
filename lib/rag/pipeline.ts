import { OpenAI } from "openai";
import { PineconeClient } from "@pinecone-database/pinecone";
import { chunkText, calculateCosineSimilarity } from "../utils";

export interface RAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: "text-embedding-3-small" | "text-embedding-3-large";
  retrievalTopK: number;
  rerankerModel?: string;
  hybridSearch: boolean;
}

interface Chunk {
  content: string;
  metadata: {
    sectionType?: string;
    index?: number;
    [key: string]: any;
  };
}

export class RAGPipeline {
  private openai: OpenAI;
  private pinecone: PineconeClient;
  private config: RAGConfig;

  constructor(
    openaiApiKey: string,
    pineconeApiKey: string,
    pineconeEnvironment: string,
    config: RAGConfig
  ) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.pinecone = new PineconeClient();
    this.config = config;
    this.initializePinecone(pineconeApiKey, pineconeEnvironment);
  }

  private async initializePinecone(apiKey: string, environment: string) {
    await this.pinecone.init({
      apiKey,
      environment,
    });
  }

  async processDocument(document: any, type: "event" | "knowledge") {
    // Extract and clean text
    const extractedText = await this.extractText(document);
    
    // Smart chunking based on content type
    const chunks = await this.intelligentChunking(extractedText, type);
    
    // Generate embeddings for each chunk
    const embeddings = await this.generateEmbeddings(chunks.map(chunk => chunk.content));
    
    // Store in vector database with metadata
    await this.storeChunks(chunks, embeddings, document.id);
    
    return { chunks: chunks.length, status: "indexed" };
  }

  private async extractText(document: any): Promise<string> {
    // For events, combine relevant fields
    if (document.type === "event") {
      return [
        document.name,
        document.description,
        document.location?.address,
        document.host?.name,
        document.tags?.join(", "),
      ]
        .filter(Boolean)
        .join("\n\n");
    }
    
    // For knowledge base documents, use the content directly
    return document.content;
  }

  private async intelligentChunking(text: string, type: string): Promise<Chunk[]> {
    if (type === "event") {
      return this.chunkEventContent(text);
    }
    
    // Use basic chunking for knowledge base documents
    const chunks = chunkText(text, this.config.chunkSize, this.config.chunkOverlap);
    return chunks.map((content, index) => ({
      content,
      metadata: { index },
    }));
  }

  private chunkEventContent(text: string): Chunk[] {
    // Split into sections based on common event structure
    const sections = {
      overview: this.extractSection(text, "overview"),
      agenda: this.extractSection(text, "agenda"),
      speakers: this.extractSection(text, "speakers"),
      logistics: this.extractSection(text, "logistics"),
      requirements: this.extractSection(text, "requirements"),
    };
    
    return Object.entries(sections)
      .filter(([_, content]) => content)
      .map(([type, content], index) => ({
        content,
        metadata: { sectionType: type, index },
      }));
  }

  private extractSection(text: string, sectionType: string): string {
    // Simple section extraction - can be enhanced with more sophisticated parsing
    const sectionRegex = new RegExp(
      `${sectionType}:\\s*([^\\n]+(?:\\n[^\\n]+)*)`,
      "i"
    );
    const match = text.match(sectionRegex);
    return match ? match[1].trim() : "";
  }

  private async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const response = await this.openai.embeddings.create({
          model: this.config.embeddingModel,
          input: text,
        });
        return response.data[0].embedding;
      })
    );
    
    return embeddings;
  }

  private async storeChunks(
    chunks: Chunk[],
    embeddings: number[][],
    documentId: string
  ) {
    const index = this.pinecone.Index("events-rag");
    
    const vectors = chunks.map((chunk, i) => ({
      id: `${documentId}-${i}`,
      values: embeddings[i],
      metadata: {
        ...chunk.metadata,
        content: chunk.content,
        documentId,
      },
    }));
    
    await index.upsert({ vectors });
  }

  async retrieve(query: string, filters?: any) {
    // Generate query embedding
    const queryEmbedding = await this.generateEmbeddings([query]);
    
    // Parallel retrieval strategies
    const [vectorResults, keywordResults] = await Promise.all([
      // Vector similarity search
      this.vectorSearch(queryEmbedding[0], filters),
      // BM25 keyword search (if enabled)
      this.config.hybridSearch ? this.keywordSearch(query, filters) : [],
    ]);
    
    // Merge and rerank results
    const mergedResults = this.mergeResults(vectorResults, keywordResults);
    const rerankedResults = await this.rerank(query, mergedResults);
    
    return rerankedResults.slice(0, this.config.retrievalTopK);
  }

  private async vectorSearch(
    queryEmbedding: number[],
    filters?: any
  ) {
    const index = this.pinecone.Index("events-rag");
    
    const results = await index.query({
      vector: queryEmbedding,
      topK: this.config.retrievalTopK * 2,
      filter: filters,
    });
    
    return results.matches.map((match) => ({
      content: match.metadata.content,
      score: match.score,
      metadata: match.metadata,
    }));
  }

  private async keywordSearch(query: string, filters?: any) {
    // Implement BM25 or other keyword search
    // This is a placeholder for the actual implementation
    return [];
  }

  private mergeResults(vectorResults: any[], keywordResults: any[]) {
    const merged = new Map();
    
    // Add vector results
    vectorResults.forEach((result) => {
      merged.set(result.metadata.documentId, {
        ...result,
        vectorScore: result.score,
      });
    });
    
    // Merge with keyword results
    keywordResults.forEach((result) => {
      const existing = merged.get(result.metadata.documentId);
      if (existing) {
        existing.keywordScore = result.score;
        existing.score = (existing.vectorScore + result.score) / 2;
      } else {
        merged.set(result.metadata.documentId, {
          ...result,
          keywordScore: result.score,
          vectorScore: 0,
        });
      }
    });
    
    return Array.from(merged.values()).sort((a, b) => b.score - a.score);
  }

  private async rerank(query: string, documents: any[]) {
    if (!this.config.rerankerModel) return documents;
    
    // Use cross-encoder for reranking
    const scores = await Promise.all(
      documents.map(async (doc) => {
        const response = await this.openai.chat.completions.create({
          model: this.config.rerankerModel!,
          messages: [
            {
              role: "system",
              content: "You are a relevance scorer. Score how relevant the document is to the query (0-1).",
            },
            {
              role: "user",
              content: `Query: ${query}\nDocument: ${doc.content}\nScore:`,
            },
          ],
          temperature: 0,
        });
        
        const score = parseFloat(response.choices[0].message.content || "0");
        return { ...doc, rerankerScore: score };
      })
    );
    
    return scores.sort((a, b) => b.rerankerScore - a.rerankerScore);
  }

  async generateWithContext(query: string, context: any[]) {
    const systemPrompt = `You are an AI assistant with access to a knowledge base about events.
    Use the provided context to answer questions accurately. If the context doesn't contain
    relevant information, say so. Always cite which events or documents you're referencing.`;
    
    const contextText = context
      .map((doc, i) => `[${i + 1}] ${doc.content}`)
      .join("\n\n");
    
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context:\n${contextText}\n\nQuestion: ${query}` },
      ],
      temperature: 0.3,
    });
    
    return {
      answer: response.choices[0].message.content,
      sources: context.map((doc) => doc.metadata),
    };
  }
} 