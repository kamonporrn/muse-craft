import { Injectable, Inject, forwardRef, Optional } from "@nestjs/common";
import { DatabaseService } from "../database.service";
import { User, Credential } from "../entities/user.entity";
import { RealtimeGateway } from "../../realtime/realtime.gateway";

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
    @Optional()
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway?: RealtimeGateway
  ) {}

  // Users CRUD
  findAll(): User[] {
    return this.db.readFile<User>("users");
  }

  findById(id: string): User | null {
    const users = this.findAll();
    return users.find((u) => u.id === id) || null;
  }

  findByEmail(email: string): User | null {
    const users = this.findAll();
    return (
      users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
    );
  }

  create(user: Omit<User, "id">): User {
    // Prevent creating Admin role through API - Admin can only be created manually
    if (user.role === "Admin") {
      throw new Error("Admin role cannot be created through API. Admin accounts must be created manually.");
    }
    
    const users = this.findAll();
    const newUser: User = {
      ...user,
      id: `u${Date.now()}`,
    };
    users.push(newUser);
    const success = this.db.writeFile("users", users);
    if (!success) {
      throw new Error("Failed to save user to database");
    }
    this.realtimeGateway?.broadcastUserUpdate("create", newUser);
    return newUser;
  }

  update(id: string, updates: Partial<User>): User | null {
    const users = this.findAll();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const currentUser = users[index];
    
    // Prevent role changes for Admin users
    if (currentUser.role === "Admin") {
      // Admin cannot change their own role
      if (updates.role && updates.role !== "Admin") {
        throw new Error("Admin role cannot be changed. Admin users must remain as Admin.");
      }
    }
    
    // Prevent changing non-admin users to Admin role
    if (updates.role === "Admin" && currentUser.role !== "Admin") {
      throw new Error("Cannot change user role to Admin. Admin accounts must be created manually.");
    }

    users[index] = { ...users[index], ...updates };
    const success = this.db.writeFile("users", users);
    if (!success) {
      throw new Error("Failed to update user in database");
    }
    this.realtimeGateway?.broadcastUserUpdate("update", users[index]);
    return users[index];
  }

  delete(id: string): boolean {
    const users = this.findAll();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;

    const success = this.db.writeFile("users", filtered);
    if (!success) {
      throw new Error("Failed to delete user from database");
    }
    // Also remove credentials
    this.removeCredentialByUser(id);
    this.realtimeGateway?.broadcastUserUpdate("delete", id);
    return true;
  }

  // Credentials
  findCredentialByEmail(email: string): Credential | null {
    const creds = this.db.readFile<Credential>("credentials");
    return (
      creds.find((c) => c.email.toLowerCase() === email.toLowerCase()) || null
    );
  }

  findCredentialByUserId(userId: string): Credential | null {
    const creds = this.db.readFile<Credential>("credentials");
    return creds.find((c) => c.userId === userId) || null;
  }

  createCredential(credential: Credential): Credential {
    const creds = this.db.readFile<Credential>("credentials");
    creds.push(credential);
    const success = this.db.writeFile("credentials", creds);
    if (!success) {
      throw new Error("Failed to save credential to database");
    }
    return credential;
  }

  updateCredential(
    userId: string,
    updates: Partial<Credential>
  ): Credential | null {
    const creds = this.db.readFile<Credential>("credentials");
    const index = creds.findIndex((c) => c.userId === userId);
    if (index === -1) return null;

    creds[index] = { ...creds[index], ...updates };
    const success = this.db.writeFile("credentials", creds);
    if (!success) {
      throw new Error("Failed to update credential in database");
    }
    return creds[index];
  }

  removeCredentialByUser(userId: string): boolean {
    const creds = this.db.readFile<Credential>("credentials");
    const filtered = creds.filter((c) => c.userId !== userId);
    if (filtered.length === creds.length) return false;

    const success = this.db.writeFile("credentials", filtered);
    if (!success) {
      throw new Error("Failed to remove credential from database");
    }
    return true;
  }

  // Auth
  validateUser(email: string, password: string): User | null {
    const cred = this.findCredentialByEmail(email);
    if (!cred || cred.password !== password) return null;

    const user = this.findById(cred.userId);
    if (!user) return null;

    if (user.status === "Suspended" || user.status === "Deleted") {
      return null;
    }

    return user;
  }
}

