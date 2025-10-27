import app from './app';
import { config } from './config/env';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   WAR Backend - Express.js Server     ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║   🚀 Server running on port ${PORT}       ║`);
  console.log(`║   🌍 Environment: ${config.nodeEnv.padEnd(19)}║`);
  console.log(`║   📅 Started: ${new Date().toLocaleTimeString().padEnd(23)}║`);
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n   API Base URL: http://localhost:${PORT}/api`);
  console.log(`   Health Check: http://localhost:${PORT}/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default server;
