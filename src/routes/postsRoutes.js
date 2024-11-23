// Importa o framework Express para criar e gerenciar o servidor
import express from "express";

// Importa o Multer para gerenciar o upload de arquivos
import multer from "multer";

// Importa as funções controladoras para as rotas de posts
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

import cors from "cors";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

// Configura o armazenamento para os arquivos enviados
const storage = multer.diskStorage({
    // Define o diretório onde os arquivos serão armazenados
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Define o nome do arquivo com base no nome original
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Cria uma instância do Multer com o diretório de destino e configurações de armazenamento
const upload = multer({ dest: "./uploads", storage });

// Define as rotas da aplicação
const routes = (app) => {
    // Configura o Express para usar JSON no corpo das requisições
    app.use(express.json());
    app.use(cors(corsOptions));
    // Rota para listar todos os posts
    app.get("/posts", listarPosts);

    // Rota para criar um novo post
    app.post("/posts", postarNovoPost);

    // Rota para fazer o upload de uma imagem
    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost)
};

// Exporta as rotas como módulo padrão
export default routes;
