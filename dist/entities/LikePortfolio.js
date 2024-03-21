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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikePortfolio = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Portfolio_1 = require("./Portfolio");
let LikePortfolio = class LikePortfolio {
};
exports.LikePortfolio = LikePortfolio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LikePortfolio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], LikePortfolio.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], LikePortfolio.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], LikePortfolio.prototype, "portfolioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], LikePortfolio.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Portfolio_1.Portfolio),
    (0, typeorm_1.JoinColumn)({ name: 'portfolioId' }),
    __metadata("design:type", Portfolio_1.Portfolio)
], LikePortfolio.prototype, "portfolio", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LikePortfolio.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], LikePortfolio.prototype, "updatedAt", void 0);
exports.LikePortfolio = LikePortfolio = __decorate([
    (0, typeorm_1.Entity)()
], LikePortfolio);
