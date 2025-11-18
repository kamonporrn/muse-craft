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
      return this.usersService.create(user);
    } catch (error) {
      throw error;
    }
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updates: Partial<User>) {
    try {
      return this.usersService.update(id, updates);
    } catch (error) {
      throw error;
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
    const user = this.usersService.validateUser(body.email, body.password);
    if (!user) {
      // Return 401 Unauthorized if credentials are invalid
      throw new UnauthorizedException("Invalid email or password.");
    }
    return user;
  }
}


