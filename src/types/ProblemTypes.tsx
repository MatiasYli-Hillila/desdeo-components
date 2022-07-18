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

type ScenarioBasedSolution = ScenarioBasedObjectiveValue[];

type ScenarioBasedSolutionCollection = {
  solutions: ScenarioBasedSolution[];
  objectivesToMaximize: Map<string, boolean>;
  objectiveIdeals?: Map<string, number>;
}

export type {
  ProblemInfo,
  ProblemType,
  MinOrMax,
  ObjectiveData,
  ObjectiveDatum,
  NavigationData,
  ScenarioBasedSolutionCollection
};
