import { ScenarioBasedSolutionCollection } from '../types/ProblemTypes';
import readCSVToScenarioBasedSolutionCollection from '../helper-functions/readCSVToScenarioBasedSolutionCollection';

export const exampleData2Objectives2Scenarios2Solutions : ScenarioBasedSolutionCollection = {
    solutions: [
        {
            solutionId: 'Solution 1',
            objectiveValues: [
                {scenarioId: 's1', objectiveId: 'o1', objectiveValue: 1.25},
                {scenarioId: 's1', objectiveId: 'o2', objectiveValue: 0.75},
                {scenarioId: 's2', objectiveId: 'o1', objectiveValue: 1.00},
                {scenarioId: 's2', objectiveId: 'o2', objectiveValue: 1.00}
            ]
        },
        {
            solutionId: 'Solution 2',
            objectiveValues: [
                {scenarioId: 's1', objectiveId: 'o1', objectiveValue: 1.50},
                {scenarioId: 's1', objectiveId: 'o2', objectiveValue: 0.50},
                {scenarioId: 's2', objectiveId: 'o1', objectiveValue: 0.25},
                {scenarioId: 's2', objectiveId: 'o2', objectiveValue: 1.50}
            ]
        }
    ],
    objectivesToMaximize: new Map<string, boolean>()
    .set('o1', true)
    .set('o2', false),
    objectiveIdeals: new Map<string, number>()
    .set('o1', 1.50)
    .set('o2', 0.50),
    objectiveNadirs: new Map<string, number>()
    .set('o1', 0.25)
    .set('o2', 1.50),
    scenarioIds: ['s1', 's2'],
    objectiveIds: ['o1', 'o2']
};

export const exampleData3Objectives3Scenarios3Solutions : ScenarioBasedSolutionCollection = {
    solutions: [
        {
            solutionId: 'Sol A',
            objectiveValues: [
                {scenarioId: 'scenario 1', objectiveId: 'objective 1', objectiveValue: 1.00},
                {scenarioId: 'scenario 1', objectiveId: 'objective 2', objectiveValue: 1.00},
                {scenarioId: 'scenario 1', objectiveId: 'objective 3', objectiveValue: 1.00},
                {scenarioId: 'scenario 2', objectiveId: 'objective 1', objectiveValue: 1.00},
                {scenarioId: 'scenario 2', objectiveId: 'objective 2', objectiveValue: 1.00},
                {scenarioId: 'scenario 2', objectiveId: 'objective 3', objectiveValue: 1.00},
                {scenarioId: 'scenario 3', objectiveId: 'objective 1', objectiveValue: 1.00},
                {scenarioId: 'scenario 3', objectiveId: 'objective 2', objectiveValue: 1.00},
                {scenarioId: 'scenario 3', objectiveId: 'objective 3', objectiveValue: 1.00}
            ]
        },
        {
            solutionId: 'Sol B',
            objectiveValues: [
                {scenarioId: 'scenario 1', objectiveId: 'objective 1', objectiveValue: 0.20},
                {scenarioId: 'scenario 1', objectiveId: 'objective 2', objectiveValue: 0.20},
                {scenarioId: 'scenario 1', objectiveId: 'objective 3', objectiveValue: 0.20},
                {scenarioId: 'scenario 2', objectiveId: 'objective 1', objectiveValue: 2.00},
                {scenarioId: 'scenario 2', objectiveId: 'objective 2', objectiveValue: 2.00},
                {scenarioId: 'scenario 2', objectiveId: 'objective 3', objectiveValue: 2.00},
                {scenarioId: 'scenario 3', objectiveId: 'objective 1', objectiveValue: 1.00},
                {scenarioId: 'scenario 3', objectiveId: 'objective 2', objectiveValue: 1.00},
                {scenarioId: 'scenario 3', objectiveId: 'objective 3', objectiveValue: 1.00}
            ]
        },
        {
            solutionId: 'Sol C',
            objectiveValues: [
                {scenarioId: 'scenario 1', objectiveId: 'objective 1', objectiveValue: 1.10},
                {scenarioId: 'scenario 1', objectiveId: 'objective 2', objectiveValue: 1.10},
                {scenarioId: 'scenario 1', objectiveId: 'objective 3', objectiveValue: 1.10},
                {scenarioId: 'scenario 2', objectiveId: 'objective 1', objectiveValue: 0.85},
                {scenarioId: 'scenario 2', objectiveId: 'objective 2', objectiveValue: 1.10},
                {scenarioId: 'scenario 2', objectiveId: 'objective 3', objectiveValue: 1.10},
                {scenarioId: 'scenario 3', objectiveId: 'objective 1', objectiveValue: 0.95},
                {scenarioId: 'scenario 3', objectiveId: 'objective 2', objectiveValue: 1.00},
                {scenarioId: 'scenario 3', objectiveId: 'objective 3', objectiveValue: 1.00}
            ]
        }
    ],
    objectivesToMaximize: new Map<string, boolean>()
    .set('objective 1', false)
    .set('objective 2', false)
    .set('objective 2', false),
    objectiveIdeals: new Map<string, number>()
    .set('objective 1', 0.20)
    .set('objective 2', 0.20)
    .set('objective 3', 0.20),
    objectiveNadirs: new Map<string, number>()
    .set('objective 1', 2.00)
    .set('objective 2', 2.00)
    .set('objective 3', 2.00),
    scenarioIds: ['scenario 1', 'scenario 2', 'scenario 3'],
    objectiveIds: ['objective 1', 'objective 2', 'objective 3']
};

export const readFileTestExampleData = readCSVToScenarioBasedSolutionCollection('./data/eg4.5data-long.csv');
