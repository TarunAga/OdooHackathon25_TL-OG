import { AppDataSource } from "../datasource";
import { Repository } from "typeorm";
import { Request, Response } from "express";
import { Question } from "../entities/Question";
import { User } from "../entities/User";

export class QuestionService {
  private questionRepository: Repository<Question>;
  private userRepository: Repository<User>;

  constructor() {
    this.questionRepository = AppDataSource.getRepository(Question);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async createQuestion(req: Request, res: Response) {
  try {
    const { title, description, tags, userId } = req.body;

    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const question = this.questionRepository.create({
      title,
      description,
      tags,
      user,
    });

    const savedQuestion = await this.questionRepository.save(question);

    return res.status(200).json(savedQuestion);
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

  async getQuestion(req: Request, res: Response) {
    const allQuestions = await this.questionRepository.find();
    if (!allQuestions) {
      return res.status(404).json({ message: "Questions not found" });
    }
    return res.status(200).json(allQuestions);
  }
}
