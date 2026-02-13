const axios = require('axios');
require('dotenv').config();

const https = require('https');

class MoltService {
  constructor() {
    this.apiKey = process.env.MOLTBOOK_API_KEY;
    this.baseUrl = process.env.MOLTBOOK_BASE_URL || 'https://www.moltbook.com/api/v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });
  }

  async getFeed() {
    try {
      const response = await this.client.get('/feed?sort=new&limit=20');
      return response.data.posts || response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error fetching feed:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching feed:', error.message);
      }
      return [];
    }
  }

  async getGlobalPosts() {
    try {
      const response = await this.client.get('/posts?sort=new&limit=20');
      return response.data.posts || response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error fetching global posts:', error.response.status, error.response.data);
      } else {
        console.error('Error fetching global posts:', error.message);
      }
      return [];
    }
  }

  async getComments(postId) {
    try {
      // heartbead.md doesn't show a specific comments endpoint, but it's likely /posts/:id/comments
      const response = await this.client.get(`/posts/${postId}/comments`);
      return response.data.comments || response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error.message);
      return [];
    }
  }

  async createPost(title, content, submolt = 'general') {
    try {
      const response = await this.client.post('/posts', { title, content, submolt });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error.message);
      throw error;
    }
  }

  async createComment(postId, content) {
    try {
      const response = await this.client.post(`/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error(`Error creating comment for post ${postId}:`, error.message);
      throw error;
    }
  }
}

module.exports = new MoltService();
