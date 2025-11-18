import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { UsersService } from "../database/services/users.service";
import { User } from "../database/entities/user.entity";
import type { Credential } from "../database/entities/user.entity";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query("email") email?: string) {
    if (email) {
      return this.usersService.findByEmail(email);
    }
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  create(@Body() user: Omit<User, "id">) {
    try {
      if (!user.email || !user.name || !user.role) {
        throw new BadRequestException("Missing required fields: email, name, role");
      }
      return this.usersService.create(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error instanceof Error ? error.message : "Failed to create user");
    }
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updates: Partial<User>) {
    try {
      const result = this.usersService.update(id, updates);
      if (!result) {
        throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error instanceof Error ? error.message : "Failed to update user");
    }
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.usersService.delete(id);
  }

  // Credentials
  @Post("credentials")
  createCredential(@Body() credential: Credential) {
    return this.usersService.createCredential(credential);
  }

  @Put("credentials/:userId")
  updateCredential(
    @Param("userId") userId: string,
    @Body() updates: Partial<Credential>
  ) {
    return this.usersService.updateCredential(userId, updates);
  }

  @Delete("credentials/:userId")
  deleteCredential(@Param("userId") userId: string) {
    return this.usersService.removeCredentialByUser(userId);
  }

  // Auth
  @Post("auth/validate")
  validateUser(@Body() body: { email: string; password: string }) {
    try {
      if (!body.email || !body.password) {
        throw new BadRequestException("Email and password are required");
      }
      const user = this.usersService.validateUser(body.email, body.password);
      if (!user) {
        // Return 401 Unauthorized if credentials are invalid
        throw new UnauthorizedException("Invalid email or password.");
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException("Authentication failed");
    }
  }
}


