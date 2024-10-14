import { Request, Response } from 'express';
import ariClient from 'ari-client';

// ARI connection configuration
const ARI_URL = process.env.ARI_URL || 'http://localhost:8088';
const ARI_USERNAME = process.env.ARI_USERNAME || 'username';
const ARI_PASSWORD = process.env.ARI_PASSWORD || '1234';


export const originateChannel = async (req: Request, res: Response) => {
    const { endpoint, chatId } = req.body; 
  
    if (!endpoint) { //PJSIP/7000
      return res.status(400).json({ error: 'Endpoint is required' });
    }
    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }
    try {
      const ari = await ariClient.connect(ARI_URL, ARI_USERNAME, ARI_PASSWORD);
      ari.channels.originate({
        endpoint, 
        extension: '7000',
        context: 'Autocall',
        priority: 1,
        variables: {
          "CHAT_ID": chatId
        }
     
      }, (err, channel) => {
        if (err) {
          console.error('Error originating channel:', err);
          res.status(500).json({ error: 'Failed to originate channel' });
          return;
        }
  
        console.log(`Channel originated with ID: ${channel.id}`);
        res.status(200).json({ message: 'Channel originated successfully', channelId: channel.id });
      });
    } catch (error) {
      console.error('ARI connection error:', error);
      res.status(500).json({ error: 'Failed to connect to ARI' });
    }
  };