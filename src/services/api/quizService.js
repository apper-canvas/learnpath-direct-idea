import quizzesData from '../mockData/quizzes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class QuizService {
  constructor() {
    this.quizzes = [...quizzesData];
  }

  async getAll() {
    await delay(200);
    return [...this.quizzes];
  }

  async getById(id) {
    await delay(200);
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) {
      throw new Error('Quiz not found');
    }
    return { ...quiz };
  }

  async getByLessonId(lessonId) {
    await delay(200);
    const quiz = this.quizzes.find(q => q.lessonId === lessonId);
    return quiz ? { ...quiz } : null;
  }

  async create(quiz) {
    await delay(400);
    const newQuiz = {
      ...quiz,
      id: Date.now().toString(),
      questions: quiz.questions || [],
      passingScore: quiz.passingScore || 70
    };
    this.quizzes.push(newQuiz);
    return { ...newQuiz };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    this.quizzes[index] = { ...this.quizzes[index], ...updates };
    return { ...this.quizzes[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Quiz not found');
    }
    this.quizzes.splice(index, 1);
    return true;
  }
}

export default new QuizService();