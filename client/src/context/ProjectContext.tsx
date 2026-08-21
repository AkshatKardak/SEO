import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { growthAPI } from "../services/api";

export interface ProjectData {
  _id: string;
  name: string;
  domain: string;
  url: string;
  growthGoal: string;
  status: string;
  growthHealthScore: number;
  scores: {
    visibility: number;
    seo: number;
    geo: number;
    conversion: number;
    content: number;
  };
  settings: {
    executionMode: "Copilot" | "Autopilot" | "Autonomous";
    autoExecuteLowRisk: boolean;
    budgetMonthlyUSD: number;
  };
  activeProfileId?: {
    companyName: string;
    industry: string;
    description: string;
    products: string[];
    services: string[];
    targetAudience: string[];
    buyerPersonas: Array<{ name: string; role: string; painPoints: string[]; goals: string[] }>;
    competitors: Array<{ name: string; domain?: string; differentiation?: string }>;
    valueProposition: string;
    keywords: string[];
    brandEntities: string[];
    contentTopics: string[];
    growthBottlenecks: string[];
  };
  lastAnalyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: ProjectData[];
  currentProject: ProjectData | null;
  loading: boolean;
  fetchProjects: () => Promise<void>;
  selectProject: (id: string) => void;
  createProject: (url: string, name?: string, goal?: string) => Promise<any>;
  updateGoal: (goal: string, mode?: string) => Promise<void>;
  reanalyzeCurrentProject: () => Promise<void>;
  deleteCurrentProject: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await growthAPI.getProjects();
      const list: ProjectData[] = res.projects || [];
      setProjects(list);

      // Select active project from localStorage or default to first
      const savedId = localStorage.getItem("activeProjectId");
      const matched = list.find((p) => p._id === savedId) || list[0] || null;
      setCurrentProject(matched);
      if (matched) {
        localStorage.setItem("activeProjectId", matched._id);
      }
    } catch (err) {
      console.warn("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const selectProject = (id: string) => {
    const found = projects.find((p) => p._id === id);
    if (found) {
      setCurrentProject(found);
      localStorage.setItem("activeProjectId", found._id);
    }
  };

  const createProject = async (url: string, name?: string, goal?: string) => {
    setLoading(true);
    try {
      const res = await growthAPI.createProject({ url, name, growthGoal: goal });
      const created = res.project;
      setProjects((prev) => [created, ...prev.filter((p) => p._id !== created._id)]);
      setCurrentProject(created);
      localStorage.setItem("activeProjectId", created._id);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (growthGoal: string, executionMode?: string) => {
    if (!currentProject) return;
    const res = await growthAPI.updateProjectGoal(currentProject._id, { growthGoal, executionMode });
    setCurrentProject(res.project);
    setProjects((prev) => prev.map((p) => (p._id === res.project._id ? res.project : p)));
  };

  const reanalyzeCurrentProject = async () => {
    if (!currentProject) return;
    setLoading(true);
    try {
      const res = await growthAPI.reanalyzeProject(currentProject._id);
      setCurrentProject(res.project);
      setProjects((prev) => prev.map((p) => (p._id === res.project._id ? res.project : p)));
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrentProject = async () => {
    if (!currentProject) return;
    await growthAPI.deleteProject(currentProject._id);
    const remaining = projects.filter((p) => p._id !== currentProject._id);
    setProjects(remaining);
    const next = remaining[0] || null;
    setCurrentProject(next);
    if (next) {
      localStorage.setItem("activeProjectId", next._id);
    } else {
      localStorage.removeItem("activeProjectId");
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        loading,
        fetchProjects,
        selectProject,
        createProject,
        updateGoal,
        reanalyzeCurrentProject,
        deleteCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProject must be used within a ProjectProvider");
  return context;
};
