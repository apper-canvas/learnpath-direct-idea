import progressData from '../mockData/userProgress.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProgressService {
  constructor() {
    this.progress = [...progressData];
  }

  async getAll() {
    await delay(250);
    return [...this.progress];
  }

  async getById(id) {
    await delay(200);
    const progress = this.progress.find(p => p.id === id);
    if (!progress) {
      throw new Error('Progress not found');
    }
    return { ...progress };
  }

  async create(progressData) {
    await delay(300);
    const newProgress = {
      ...progressData,
      id: Date.now().toString(),
      completedLessons: progressData.completedLessons || [],
      quizScores: progressData.quizScores || {},
      notes: progressData.notes || {},
      lastAccessed: new Date()
    };
    this.progress.push(newProgress);
    return { ...newProgress };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.progress.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    this.progress[index] = { ...this.progress[index], ...updates };
    return { ...this.progress[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.progress.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Progress not found');
    }
    this.progress.splice(index, 1);
    return true;
  }

  async getByCourseId(courseId) {
    await delay(200);
    const progress = this.progress.find(p => p.courseId === courseId);
    return progress ? { ...progress } : null;
  }
}

export default new UserProgressService();