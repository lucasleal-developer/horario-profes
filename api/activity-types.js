import { storage } from '../dist/server/storage.js';
import { insertActivityTypeSchema } from '../shared/schema';

export default async function handler(req, res) {
  console.log('API: /api/activity-types - Iniciando requisição');
  console.log('API: Método:', req.method);
  console.log('API: Query params:', req.query);
  console.log('API: Body:', req.body);

  const method = req.method;

  // Rotas para tipos de atividades
  try {
    if (method === 'GET') {
      console.log('API: Processando GET request');
      if (req.query.id) {
        console.log('API: Buscando tipo de atividade por ID:', req.query.id);
        const activityType = await storage.getActivityType(Number(req.query.id));
        if (!activityType) {
          console.log('API: Tipo de atividade não encontrado');
          return res.status(404).json({ error: 'Tipo de atividade não encontrado' });
        }
        console.log('API: Tipo de atividade encontrado:', activityType);
        return res.status(200).json(activityType);
      } else if (req.query.code) {
        console.log('API: Buscando tipo de atividade por código:', req.query.code);
        const activityType = await storage.getActivityTypeByCode(req.query.code);
        if (!activityType) {
          console.log('API: Tipo de atividade não encontrado');
          return res.status(404).json({ error: 'Tipo de atividade não encontrado' });
        }
        console.log('API: Tipo de atividade encontrado:', activityType);
        return res.status(200).json(activityType);
      } else {
        console.log('API: Buscando todos os tipos de atividades');
        const activityTypes = await storage.getAllActivityTypes();
        console.log('API: Total de tipos de atividades encontrados:', activityTypes.length);
        return res.status(200).json(activityTypes);
      }
    }
    
    else if (method === 'POST') {
      console.log('API: Processando POST request');
      try {
        console.log('API: Validando dados do tipo de atividade');
        const validatedData = insertActivityTypeSchema.parse(req.body);
        console.log('API: Dados validados:', validatedData);
        const activityType = await storage.createActivityType(validatedData);
        console.log('API: Tipo de atividade criado:', activityType);
        return res.status(201).json(activityType);
      } catch (error) {
        console.error('API: Erro ao criar tipo de atividade:', error);
        return res.status(400).json({ error: 'Dados inválidos', details: error.message });
      }
    }
    
    else if (method === 'PUT') {
      console.log('API: Processando PUT request');
      try {
        const id = Number(req.query.id);
        if (!id) {
          console.log('API: ID não fornecido');
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        
        console.log('API: Verificando tipo de atividade existente:', id);
        const existingActivityType = await storage.getActivityType(id);
        if (!existingActivityType) {
          console.log('API: Tipo de atividade não encontrado');
          return res.status(404).json({ error: 'Tipo de atividade não encontrado' });
        }
        
        console.log('API: Validando dados de atualização');
        const validatedData = insertActivityTypeSchema.partial().parse(req.body);
        console.log('API: Dados validados:', validatedData);
        const updated = await storage.updateActivityType(id, validatedData);
        
        if (!updated) {
          console.log('API: Erro ao atualizar tipo de atividade');
          return res.status(404).json({ error: 'Tipo de atividade não encontrado' });
        }
        
        console.log('API: Tipo de atividade atualizado:', updated);
        return res.status(200).json(updated);
      } catch (error) {
        console.error('API: Erro ao atualizar tipo de atividade:', error);
        return res.status(400).json({ error: 'Dados inválidos', details: error.message });
      }
    }
    
    else if (method === 'DELETE') {
      console.log('API: Processando DELETE request');
      try {
        const id = Number(req.query.id);
        if (!id) {
          console.log('API: ID não fornecido');
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        
        console.log('API: Verificando tipo de atividade existente:', id);
        const existingActivityType = await storage.getActivityType(id);
        if (!existingActivityType) {
          console.log('API: Tipo de atividade não encontrado');
          return res.status(404).json({ error: 'Tipo de atividade não encontrado' });
        }
        
        console.log('API: Excluindo tipo de atividade:', id);
        const deleted = await storage.deleteActivityType(id);
        if (!deleted) {
          console.log('API: Erro ao excluir tipo de atividade');
          return res.status(500).json({ error: 'Erro ao excluir tipo de atividade' });
        }
        
        console.log('API: Tipo de atividade excluído com sucesso');
        return res.status(204).end();
      } catch (error) {
        console.error('API: Erro ao excluir tipo de atividade:', error);
        return res.status(500).json({ error: 'Erro ao processar solicitação', details: error.message });
      }
    }
    
    else {
      console.log('API: Método não permitido:', method);
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Método ${method} não permitido` });
    }
  } catch (error) {
    console.error('API: Erro ao processar requisição de tipos de atividades:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}