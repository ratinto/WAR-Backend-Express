import { Router } from 'express';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';
import dashboardRoutes from './dashboard.routes';
import adminRoutes from './admin.routes';
import { getWashermanDashboard } from '../controllers/dashboard.controller';

const router = Router();

// Health check for API routes
router.get('/status', (_req, res) => {
  res.json({
    message: 'WAR API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/*',
      orders: '/api/orders/*',
      dashboard: '/api/student/dashboard/* or /api/washerman/dashboard'
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);  // Admin CRUD routes for students and washermen

// Dashboard routes - mount at specific paths to match Django URLs
router.use('/student/dashboard', dashboardRoutes);  // GET /api/student/dashboard/:bagNo
router.get('/washerman/dashboard', getWashermanDashboard);  // GET /api/washerman/dashboard

export default router;
