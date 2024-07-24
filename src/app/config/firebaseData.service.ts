import { Injectable } from '@angular/core';
import { ref, get, set, push, remove  } from 'firebase/database';
import { database } from '../config/firebaseConfig';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {

  constructor() { }

  // Функція для отримання даних з Realtime Database
  async fetchData(path: string): Promise<any> {
    const dbRef = ref(database, path); // Вказати шлях до даних
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        return snapshot.val(); // Повертає отримані дані
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  }

  // Функція для створення нового поста
  async createPost(postData: any): Promise<void> {
    const postsRef = ref(database, 'posts'); // Вказати шлях до постів
    const newPostRef = push(postsRef); // Отримати новий унікальний ідентифікатор
    try {
      await set(newPostRef, postData);
      // console.log('Post created successfully with ID:', newPostRef.key);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Функція для видалення поста
  async deletePost(postId: string): Promise<void> {
    const postRef = ref(database, `posts/${postId}`);
    try {
      await remove(postRef);
      // console.log('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

    // Функція для редагування поста
    async updatePost(postId: string, updatedData: any): Promise<void> {
      const postRef = ref(database, `posts/${postId}`);
      try {
        await set(postRef, updatedData);
        // console.log('Post updated successfully');
      } catch (error) {
        console.error('Error updating post:', error);
        throw error;
      }
    }
}
