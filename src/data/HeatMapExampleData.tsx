import {
    ScenarioBasedObjectiveValue, 
    ScenarioBasedSolutionCollection
} from '../types/ProblemTypes';
import { csv } from "d3-fetch";

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

function getReadFileTestExampleData() {
  const testData = csv('./data/eg4.5data-long.csv');
  console.log(testData);
  var readFileSolutionCollection: ScenarioBasedSolutionCollection = {
    solutions: [],
    objectivesToMaximize: new Map<string, boolean>(),
    objectiveIdeals: new Map<string, number>(),
    objectiveNadirs: new Map<string,  number>(),
    scenarioIds: [],
    objectiveIds: []
  };
  // TODO: move these to proper place
  var readFileSolutionIds: string[] = [];
  var readFileScenarioIds: string[] = [];
  var readFileObjectiveIds: string[] = [];
  
  testData.then(data => {
    //if (data[0] === undefined || data[0] === null) return;
    console.log(data);
    var currentSolutionId: string = '';
    var currentScenarioId: string = '';
    var currentObjectiveValuesArray: ScenarioBasedObjectiveValue[] = [];
    //var currentObjectiveId: string = '';
    for (let i = 0; i < data.length; i++)
    {
      for (const key in data[i])
      {
        if (key === 'scenario') 
        { 
          // TODO: figure out how to remove ts-ignore here
          // @ts-ignore
          currentScenarioId = data[i][key]?.toString(); 
          //console.log(currentScenarioId);
          //console.log(readFileScenarioIds.find(value => (value === currentScenarioId)));
          // TODO: see if this can be done without eslint-disable
          // eslint-disable-next-line no-loop-func
          if (readFileScenarioIds.find(value => (value === currentSolutionId)) === undefined) readFileScenarioIds.push(currentScenarioId);
          //console.log(readFileScenarioIds);
          continue; 
        }
        else if (key === 'solution') 
        { 
          // TODO: figure out how to remove ts-ignore here
          // @ts-ignore
          currentSolutionId = data[i][key]?.toString(); 
          //console.log(currentSolutionId);
          // TODO: see if this can be done without eslint-disable
          // eslint-disable-next-line no-loop-func
          if (readFileSolutionIds.find(value => (value === currentSolutionId)) === undefined) readFileSolutionIds.push(currentSolutionId);
          //console.log(readFileSolutionIds);
          continue; 
        }
        else var newObjectiveValue: ScenarioBasedObjectiveValue = {
          scenarioId: currentScenarioId,
          objectiveId: key,
          // TODO: figure out how to remove ts-ignore here
          // @ts-ignore
          objectiveValue: parseFloat(data[i][key])
        };
        //console.log(newObjectiveValue);
        if (readFileObjectiveIds.find(value => (value === key)) === undefined) readFileObjectiveIds.push(key);
        currentObjectiveValuesArray.push(newObjectiveValue);
        //console.log(`data[0][key]: ${data[0][key]}, type: ${type(parseFloat(data[0][key]))}`)
      }
      //console.log(currentObjectiveValuesArray);
      readFileSolutionCollection.solutions.push(
        { solutionId: currentSolutionId, objectiveValues: currentObjectiveValuesArray }
        );
      }
      
      readFileSolutionCollection.objectiveIds = readFileObjectiveIds;
      readFileSolutionCollection.scenarioIds = readFileScenarioIds;
      for (const key in readFileObjectiveIds)
      {
        readFileSolutionCollection.objectivesToMaximize.set(key, false);
        // TODO: calculate the actual ideal here
        readFileSolutionCollection.objectiveIdeals.set(key, 1);
      };
    });
    
    console.log(readFileSolutionCollection);
    return readFileSolutionCollection;
  }
  
  export const readFileTestExampleData = getReadFileTestExampleData();
  