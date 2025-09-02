import { LoginDto, LoginResponseDto } from '../dto/auth.dto';

export interface IAuthService {
  login(credentials: LoginDto): Promise<LoginResponseDto>;
  validatePassword(email: string, password: string): Promise<boolean>;
  verifyEmail(token: string): Promise<boolean>;
  resendVerificationEmail(email: string): Promise<boolean>;
}