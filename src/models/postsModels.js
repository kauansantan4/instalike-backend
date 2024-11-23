// Importa a função para conectar ao banco de dados
import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Estabelece conexão com o banco de dados usando a string de conexão fornecida no ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função para obter todos os posts do banco de dados
export async function getTodosPosts() {
    // Seleciona o banco de dados específico
    const db = conexao.db("imersao-instabytes");
    // Acessa a coleção "posts" no banco de dados
    const colecao = db.collection("posts");
    // Recupera todos os documentos da coleção e os retorna como um array
    return colecao.find().toArray();
}

// Função para inserir um novo post no banco de dados
export async function criarPost(novoPost) {
    // Seleciona o banco de dados específico
    const db = conexao.db("imersao-instabytes");
    // Acessa a coleção "posts" no banco de dados
    const colecao = db.collection("posts");
    // Insere o novo post na coleção e retorna o resultado da operação
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id)
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost});
}

