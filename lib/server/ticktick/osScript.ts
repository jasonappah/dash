import { Project } from "./project";
import { Task } from "./task";
import { convertMacTime2JSTime } from "./date";
import { runAppleScript } from "run-applescript";

const taskObject2Task = (object: Record<string, any>): Task => {
  return {
    id: object.id as string,
    title: object.title as string,
    priority: object.priority as Task["priority"],
    projectId: object.projectId as Task["projectId"],
  };
};

const projectObject2Project = (object: Record<string, any>): Project => {
  return {
    id: object.id as string,
    name: object.name as string,
  };
};

const checkAppInstalled = async () => {
  try {
    const result = await runAppleScript(`
    exists application "TickTick"
    `);

    if (result === "false") {
      return false;
    }

    return true;
  } catch (error) {
    errorHandler(error)
    return false;
  }
};

const errorHandler = (err: any) => {
  console.error("TickTick error", err);
};

export const getToday = async () => {
  const installed = await checkAppInstalled();
  if (!installed) return [];
  try {
    const result = (await runAppleScript(`
    set result to ""
    tell application "TickTick"
	    set result to today tasks from "raycast"
    end tell
    return result
  `)) as string;
    if (result === "missing value") {
      return [];
    }
    const parsedResult = JSON.parse(result);
    return parsedResult.map((section: any) => {
      if (section.id === "note") {
        return {
          id: "note",
          name: "Note",
          children: section.tasks.map(taskObject2Task),
        };
      }
      return {
        id: `date-${section.date}`,
        name: (new Date(convertMacTime2JSTime(section.date))).toISOString(),
        children: section.tasks.map(taskObject2Task),
      };
    });
  } catch (e) {
    errorHandler(e);
    return [];
  }
};

export const getNext7Days = async () => {
  const installed = await checkAppInstalled();
  if (!installed) return [];
  try {
    const result = (await runAppleScript(`
    set result to ""
    tell application "TickTick"
	    set result to next7days tasks from "raycast"
    end tell
    return result
  `)) as string;
    if (result === "missing value") {
      return [];
    }
    const parsedResult = JSON.parse(result);
    return parsedResult.map((section: any) => {
      if (section.id === "note") {
        return {
          id: "note",
          name: "Note",
          children: section.tasks.map(taskObject2Task),
        };
      }
      return {
        id: `date-${section.date}`,
        name: (new Date(convertMacTime2JSTime(section.date))).toISOString(),
        children: section.tasks.map(taskObject2Task),
      };
    });
  } catch (e) {
    errorHandler(e);
    return [];
  }
};

export const getSearchByKeyword = async (keyword: string) => {
  const installed = await checkAppInstalled();
  if (!installed) return [];
  try {
    const result = (await runAppleScript(`
    set result to ""
    tell application "TickTick"
      set result to search tasks "${keyword}" from "raycast"
    end tell
    return result
  `)) as string;
    if (result === "missing value") {
      return [];
    }
    const parsedResult = JSON.parse(result);
    return parsedResult.map(taskObject2Task);
  } catch (e) {
    errorHandler(e);
    return [];
  }
};

export const getProjectId2Project = async () => {
  const installed = await checkAppInstalled();
  if (!installed) return {};
  try {
    const result = (await runAppleScript(`
    set result to ""
    tell application "TickTick"
      set result to projects from "raycast"
    end tell
    return result
  `)) as string;
    if (result === "missing value") {
      return {};
    }

    const parsedResult = JSON.parse(result);
    const projectId2Project: Record<string, Project> = {};
    parsedResult.forEach((project: any) => {
      projectId2Project[project.id] = projectObject2Project(project);
    });
    return projectId2Project;
  } catch (e) {
    errorHandler(e);
    return {};
  }
};