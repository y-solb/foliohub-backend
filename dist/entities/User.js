"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Portfolio_1 = require("./Portfolio");
const AuthToken_1 = __importDefault(require("./AuthToken"));
const data_source_1 = require("../data-source");
const token_1 = require("../libs/token");
const SocialLink_1 = require("./SocialLink");
let User = class User {
    generateUserToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = (0, token_1.generateToken)({
                userId: this.id,
            }, {
                subject: 'accessToken',
                expiresIn: '2m',
            });
            const refreshToken = (0, token_1.generateToken)({}, {
                subject: 'refreshToken',
                expiresIn: '14d',
            });
            const authToken = new AuthToken_1.default();
            authToken.userId = this.id;
            authToken.token = refreshToken;
            authToken.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            yield data_source_1.AppDataSource.getRepository(AuthToken_1.default).save(authToken);
            return {
                accessToken,
                refreshToken,
            };
        });
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "providerId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Portfolio_1.Portfolio, (portfolio) => portfolio.user, { cascade: true }),
    __metadata("design:type", Portfolio_1.Portfolio)
], User.prototype, "portfolio", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => SocialLink_1.SocialLink, (socialLink) => socialLink.user, { cascade: true }),
    __metadata("design:type", SocialLink_1.SocialLink)
], User.prototype, "socialLink", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
