// Importa funções para interagir com o banco de dados relacionadas aos posts
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";

// Importa o módulo 'fs' para manipulação de arquivos
import fs from "fs";

import gerarDescricaoComGemini from "../services/GeminiService.js";

// Controlador para listar todos os posts
export async function listarPosts(req, res) {
    // Obtém todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Envia os posts como resposta em formato JSON com status HTTP 200 (OK)
    res.status(200).json(posts);
}

// Controlador para criar um novo post
export async function postarNovoPost(req, res) {
    // Recupera os dados do novo post do corpo da requisição
    const novoPost = req.body;
    try {
        // Chama a função para salvar o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Retorna o post criado como resposta com status HTTP 200 (OK)
        res.status(200).json(postCriado);
    } catch (erro) {
        // Em caso de erro, registra a mensagem no console
        console.error(erro.message);
        // Envia uma resposta de erro com status HTTP 500 (Internal Server Error)
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Controlador para fazer upload de uma imagem associada a um post
export async function uploadImagem(req, res) {
    // Cria um objeto de post inicial com informações da imagem enviada
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname, // Define o nome original do arquivo como URL da imagem
        alt: ""
    };

    try {
        // Salva o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Define o novo caminho e nome para o arquivo de imagem (usando o ID gerado pelo banco)
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo no sistema de arquivos
        fs.renameSync(req.file.path, imagemAtualizada);
        // Retorna o post criado como resposta com status HTTP 200 (OK)
        res.status(200).json(postCriado);
    } catch (erro) {
        // Em caso de erro, registra a mensagem no console
        console.error(erro.message);
        // Envia uma resposta de erro com status HTTP 500 (Internal Server Error)
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function atualizarNovoPost(req, res) {
    
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imageBuffer)
        
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}