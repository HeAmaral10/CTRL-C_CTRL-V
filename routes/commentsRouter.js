import express from "express";
import { Publicacao, sequelize, Usuario, Comentario } from "./modelos.js";

const router = express.Router();

router.post("/comentarios", async (req, res) => {

    const { publicacao_id, usuario_id, comentario } = req.body;
    const usuarioExiste = await Usuario.findByPk(usuario_id);
    const publicacaoExiste = await Publicacao.findByPk(publicacao_id);

    try {
        if (publicacao_id.trim() === "" || usuario_id.trim() === "" || comentario.trim() === "") {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        if (!usuarioExiste) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }
        if (!publicacaoExiste) {
            return res.status(400).json({ erro: "Publicação não encontrada" });
        }

        const novoComentario = await Comentario.create({
            comentario,
            comentario_id,
            publicacao_id,
            usuario_id,
        });

        return res.status(201).json(novoComentario);

    } catch (error) {
        return res.status(500).json({ erro: "Erro ao criar comentário" });
    }

});

router.delete("/comentarios", async (req, res) => {

    const { comentario_id, usuario_id } = req.body;
    const usuarioExiste = await Usuario.findByPk(usuario_id);
    const comentario = await Comentario.findByPk(comentario_id);

    try {
        if (!usuarioExiste) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }
        if (!comentario) {
            return res.status(400).json({ erro: "Comentário não encontrado" });
        }

        if (comentario.usuario_id !== usuario_id) {
            return res.status(403).json({ erro: "Usuário não autorizado" });
        }

        await comentario.destroy();

        return res.status(204).json({});

    } catch (error) {}
    
});

export default router;