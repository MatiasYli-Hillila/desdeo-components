type ProblemType = "Analytical" | "Discrete";
type MinOrMax = 1 | -1;

type ProblemInfo = {
  problemId: number;
  problemName: string;
  problemType: ProblemType;
  objectiveNames: string[];
  variableNames: string[];
  nObjectives: number;
  ideal: number[];
  nadir: number[];
  minimize: MinOrMax[];
};

// one objective vector
type ObjectiveDatum = {
  selected: boolean;
  value: number[];
};

type ObjectiveData = {
  values: ObjectiveDatum[];
  names: string[];
  directions: MinOrMax[];
  ideal: number[];
  nadir: number[];
};

type NavigationData = {
  upperBounds: number[][];
  lowerBounds: number[][];
  referencePoints: number[][];
  boundaries: number[][];
  totalSteps: number;
  stepsTaken: number;
  distance?: number;
  reachableIdx?: number[];
  stepsRemaining?: number;
  navigationPoint?: number[];
};

type ScenarioBasedObjectiveValue = {
  scenarioId: string;
  objectiveId: string;
  objectiveValue: number;
}

type ScenarioBasedSolution = {
  solutionId: string;
  objectiveValues: ScenarioBasedObjectiveValue[];
}

type ScenarioBasedSolutionCollection = {
  solutions: ScenarioBasedSolution[];
  /*
    TODO: Should maximize, ideals, and nadirs be in one Map? e.g. Map<string, [boolean, number, number]>?
    If so, then what would the name be? Need to also communicate effectively which number is ideal and which nadir.
    objectivesToMaximizeAndIdealsAndNadirs seems like a cumbersome name.
  */
  objectivesToMaximize: Map<string, boolean>;
  objectiveIdeals: Map<string, number>;
  objectiveNadirs: Map<string, number>;
  scenarioIds: string[];
  objectiveIds: string[];
}

export type {
  ProblemInfo,
  ProblemType,
  MinOrMax,
  ObjectiveData,
  ObjectiveDatum,
  NavigationData,
  ScenarioBasedObjectiveValue,
  ScenarioBasedSolution,
  ScenarioBasedSolutionCollection
};
