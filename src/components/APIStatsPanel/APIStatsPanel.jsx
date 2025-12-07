import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Stack,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CachedIcon from '@mui/icons-material/Cached';
import SpeedIcon from '@mui/icons-material/Speed';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { apiCache, rateLimiter } from '../../utils/apiCache';

const APIStatsPanel = () => {
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState({
    cache: { size: 0, maxSize: 10 },
    rateLimit: { remaining: 15, limit: 15, resetInMinutes: 0 },
  });

  const updateStats = () => {
    const cacheStats = apiCache.getStats();
    const rateLimitStats = rateLimiter.getStats();
    setStats({
      cache: cacheStats,
      rateLimit: rateLimitStats,
    });
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    apiCache.clear();
    updateStats();
  };

  const handleResetRateLimit = () => {
    if (window.confirm('Reset rate limit? This should only be used for testing.')) {
      rateLimiter.reset();
      updateStats();
    }
  };

  const cachePercentage = (stats.cache.size / stats.cache.maxSize) * 100;
  const rateLimitPercentage = (stats.rateLimit.remaining / stats.rateLimit.limit) * 100;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        width: expanded ? 320 : 'auto',
        zIndex: 1100,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          bgcolor: 'primary.main',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon fontSize="small" />
          <Typography variant="body2" fontWeight="bold">
            API Stats
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            color: 'white',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Cache Stats */}
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CachedIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight="bold">
                  Cache
                </Typography>
              </Box>
              <Tooltip title="Clear cache">
                <IconButton size="small" onClick={handleClearCache}>
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {stats.cache.size} / {stats.cache.maxSize} entries
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cachePercentage.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={cachePercentage}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: cachePercentage > 80 ? 'warning.main' : 'success.main',
                  },
                }}
              />
            </Box>
          </Stack>

          {/* Rate Limit Stats */}
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight="bold">
                  Rate Limit
                </Typography>
              </Box>
              {process.env.NODE_ENV === 'development' && (
                <Tooltip title="Reset rate limit (dev only)">
                  <IconButton size="small" onClick={handleResetRateLimit}>
                    <CachedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {stats.rateLimit.remaining} / {stats.rateLimit.limit} requests
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {rateLimitPercentage.toFixed(0)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={rateLimitPercentage}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor:
                      rateLimitPercentage < 20
                        ? 'error.main'
                        : rateLimitPercentage < 50
                        ? 'warning.main'
                        : 'success.main',
                  },
                }}
              />
              {stats.rateLimit.resetInMinutes > 0 && stats.rateLimit.remaining === 0 && (
                <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: 'block' }}>
                  Reset in {stats.rateLimit.resetInMinutes} min
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Info Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
            <Chip
              label="5 min cache"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
            <Chip
              label="15 req/hour"
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default APIStatsPanel;
