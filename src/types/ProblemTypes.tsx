/* TODO: Better use of types/interfaces for ProblemTypes.
Some of the types in this file should probably be combined, and better
use of type intersections (or interface extensions) be made.
TODO: More documentation for ProblemTypes.
*/

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
};

type ScenarioBasedObjectiveVector = {
    scenarioId: string;
    objectiveValues: number[];
};

/**
 * Solution to a scenario-based multiobjective optimization problem,
 * where objective _values_ associated to specific scenario and
 * objective are stored in an array.
 */
type ScenarioBasedSolutionUsingObjectiveValues = {
    solutionId: string;
    objectiveValues: ScenarioBasedObjectiveValue[];
};

/**
 * Solution to a scenario-based multiobjective optimization problem,
 * where objective _vectors_ associated to specific scenario are stored
 * in an array.
 */
type ScenarioBasedSolutionUsingObjectiveVectors = {
    solutionId: string;
    objectiveVectors: ScenarioBasedObjectiveVector[];
}

type ScenarioBasedProblemInfo = {
    /* TODO: Should maximize, ideals, and nadirs be in one Map?
    e.g. Map<string, [boolean, number, number]>? If so, then what would
    the name be? Need to also communicate effectively which number is
    ideal and which nadir.
    objectivesToMaximizeAndIdealsAndNadirs seems like a cumbersome name.
    */
    objectivesToMaximize: Map<string, boolean>;
    objectiveIdeals: Map<string, number>;
    objectiveNadirs: Map<string, number>;
    scenarioIds: string[];
    objectiveIds: string[];
};

type ScenarioBasedSolutionCollectionUsingObjectiveValuesArray = ScenarioBasedProblemInfo & {
    solutions: ScenarioBasedSolutionUsingObjectiveValues[];
};

type ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray = ScenarioBasedProblemInfo & {
    solutions: ScenarioBasedSolutionUsingObjectiveVectors[];
}

export type {
    ProblemInfo,
    ProblemType,
    MinOrMax,
    ObjectiveData,
    ObjectiveDatum,
    NavigationData,
    ScenarioBasedObjectiveValue,
    ScenarioBasedObjectiveVector,
    ScenarioBasedSolutionUsingObjectiveValues,
    ScenarioBasedSolutionUsingObjectiveVectors,
    ScenarioBasedSolutionCollectionUsingObjectiveValuesArray,
    ScenarioBasedSolutionCollectionUsingObjectiveVectorsArray
};
