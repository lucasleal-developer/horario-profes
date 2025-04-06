// Este é um arquivo de coletor que importa todas as rotas da API
// Ele é usado pela Vercel para identificar os endpoints da API

// Exportando as funções serverless para a Vercel
export { default as professionals } from './professionals';
export { default as activityTypes } from './activity-types';
export { default as timeSlots } from './time-slots';
export { default as schedules } from './schedules';

import { storage } from '../dist/server/storage.js';

export default async function handler(req, res) {
  const { path } = req.query;
  console.log(`API: Iniciando requisição para ${path}`);

  try {
    switch (path) {
      case 'professionals':
        return handleProfessionals(req, res);
      case 'activity-types':
        return handleActivityTypes(req, res);
      case 'schedules':
        return handleSchedules(req, res);
      case 'time-slots':
        return handleTimeSlots(req, res);
      default:
        res.status(404).json({ error: 'Endpoint não encontrado' });
    }
  } catch (error) {
    console.error('API: Erro interno:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handleProfessionals(req, res) {
  const { method, query, body } = req;
  console.log(`API: Professionals - ${method}`, { query, body });

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const professional = await storage.findProfessionalById(query.id);
          return res.json(professional);
        }
        const professionals = await storage.findAllProfessionals();
        return res.json(professionals);
      case 'POST':
        const newProfessional = await storage.createProfessional(body);
        return res.status(201).json(newProfessional);
      case 'PUT':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        const updatedProfessional = await storage.updateProfessional(query.id, body);
        return res.json(updatedProfessional);
      case 'DELETE':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        await storage.deleteProfessional(query.id);
        return res.status(204).end();
      default:
        res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('API: Erro em professionals:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handleActivityTypes(req, res) {
  const { method, query, body } = req;
  console.log(`API: Activity Types - ${method}`, { query, body });

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const activityType = await storage.findActivityTypeById(query.id);
          return res.json(activityType);
        }
        const activityTypes = await storage.findAllActivityTypes();
        return res.json(activityTypes);
      case 'POST':
        const newActivityType = await storage.createActivityType(body);
        return res.status(201).json(newActivityType);
      case 'PUT':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        const updatedActivityType = await storage.updateActivityType(query.id, body);
        return res.json(updatedActivityType);
      case 'DELETE':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        await storage.deleteActivityType(query.id);
        return res.status(204).end();
      default:
        res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('API: Erro em activity-types:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handleSchedules(req, res) {
  const { method, query, body } = req;
  console.log(`API: Schedules - ${method}`, { query, body });

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const schedule = await storage.findScheduleById(query.id);
          return res.json(schedule);
        }
        const schedules = await storage.findAllSchedules();
        return res.json(schedules);
      case 'POST':
        const newSchedule = await storage.createSchedule(body);
        return res.status(201).json(newSchedule);
      case 'PUT':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        const updatedSchedule = await storage.updateSchedule(query.id, body);
        return res.json(updatedSchedule);
      case 'DELETE':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        await storage.deleteSchedule(query.id);
        return res.status(204).end();
      default:
        res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('API: Erro em schedules:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handleTimeSlots(req, res) {
  const { method, query, body } = req;
  console.log(`API: Time Slots - ${method}`, { query, body });

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          const timeSlot = await storage.findTimeSlotById(query.id);
          return res.json(timeSlot);
        }
        const timeSlots = await storage.findAllTimeSlots();
        return res.json(timeSlots);
      case 'POST':
        const newTimeSlot = await storage.createTimeSlot(body);
        return res.status(201).json(newTimeSlot);
      case 'PUT':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        const updatedTimeSlot = await storage.updateTimeSlot(query.id, body);
        return res.json(updatedTimeSlot);
      case 'DELETE':
        if (!query.id) {
          return res.status(400).json({ error: 'ID não fornecido' });
        }
        await storage.deleteTimeSlot(query.id);
        return res.status(204).end();
      default:
        res.status(405).json({ error: 'Método não permitido' });
    }
  } catch (error) {
    console.error('API: Erro em time-slots:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}