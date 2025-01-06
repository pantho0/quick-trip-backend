"use strict";
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
exports.upload = exports.uploadImage = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloud_name,
    api_key: config_1.default.cloud_api,
    api_secret: config_1.default.cloud_api_secret,
});
const uploadImage = (imageName, path) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadResult = yield cloudinary_1.v2.uploader
        .upload(path, {
        public_id: imageName,
    })
        .catch((_error) => {
        fs_1.default.unlink(path, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('File deleted');
            }
        });
    });
    if (uploadResult) {
        fs_1.default.unlink(path, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log('File deleted');
            }
        });
        return uploadResult;
    }
});
exports.uploadImage = uploadImage;
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, process.cwd() + '/uploads');
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
