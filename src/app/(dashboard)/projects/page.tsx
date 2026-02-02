'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { GRADE_LEVELS, DESIGN_CYCLE_PHASES } from '@/lib/constants';
import type { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (gradeFilter) params.set('gradeLevel', gradeFilter);
      if (phaseFilter) params.set('designCyclePhase', phaseFilter);

      const response = await fetch(`/api/projects?${params.toString()}`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }, [gradeFilter, phaseFilter]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const clearFilters = () => {
    setGradeFilter('');
    setPhaseFilter('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Browse and share student work documentation</p>
        </div>
        <Link href="/projects/new">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          options={[
            { value: '', label: 'All Grades' },
            ...GRADE_LEVELS.map((g) => ({ value: g, label: g })),
          ]}
          className="w-40"
        />
        <Select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          options={[
            { value: '', label: 'All Phases' },
            ...DESIGN_CYCLE_PHASES.map((p) => ({ value: p, label: p })),
          ]}
          className="w-40"
        />
        {(gradeFilter || phaseFilter) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">
            Be the first to share a student project!
          </p>
          <Link href="/projects/new">
            <Button>Create First Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
