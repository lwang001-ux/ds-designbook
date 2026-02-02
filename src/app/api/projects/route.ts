import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/db';
import type { Project } from '@/lib/types';

// GET all projects with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gradeLevel = searchParams.get('gradeLevel');
    const designCyclePhase = searchParams.get('designCyclePhase');

    let projects = await readData<Project[]>('projects.json');

    // Apply filters
    if (gradeLevel) {
      projects = projects.filter((p) => p.gradeLevel === gradeLevel);
    }
    if (designCyclePhase) {
      projects = projects.filter((p) => p.designCyclePhase === designCyclePhase);
    }

    // Sort by creation date (newest first)
    projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, images, gradeLevel, designCyclePhase, unit, tags, authorId, authorName, authorPhotoURL } = body;

    if (!title || !authorId) {
      return NextResponse.json({ error: 'Title and author required' }, { status: 400 });
    }

    const projects = await readData<Project[]>('projects.json');

    const newProject: Project = {
      id: generateId(),
      title,
      description: description || '',
      images: images || [],
      gradeLevel: gradeLevel || '',
      designCyclePhase: designCyclePhase || '',
      unit: unit || '',
      tags: tags || [],
      authorId,
      authorName,
      authorPhotoURL: authorPhotoURL || null,
      likes: [],
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    await writeData('projects.json', projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const projects = await readData<Project[]>('projects.json');
    const projectIndex = projects.findIndex((p) => p.id === id);

    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await writeData('projects.json', projects);

    return NextResponse.json(projects[projectIndex]);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const projects = await readData<Project[]>('projects.json');
    const filteredProjects = projects.filter((p) => p.id !== id);

    if (filteredProjects.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await writeData('projects.json', filteredProjects);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
