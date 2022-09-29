import { 
  ObjectiveData, 
  ProblemInfo, 
  NavigationData,
  ScenarioBasedObjectiveValue, 
  ScenarioBasedSolution,
  ScenarioBasedSolutionCollection
} from "../types/ProblemTypes";

import { csv } from "d3-fetch";
import { stringify } from "querystring";

export const exampleProblemInfo3ObjectiveData: ProblemInfo = {
  problemId: 0,
  problemName: "TestProblem",
  problemType: "Discrete",
  objectiveNames: ["Outlet Gases", "Enviromental Damage", "Profit"],
  variableNames: ["X", "Y", "Z"],
  nObjectives: 3,
  ideal: [0,0,5],
  nadir: [10, 2,  -5],
  minimize: [1,1,-1],
}

export const exampleProblemData3ObjectiveData: NavigationData = {
  upperBounds: [
    [10,9,7,5,5,5], // objective 1
    [2.0,1.9,1.5,0.8,0.6,0.6], // objective 2
    [5,4.5,4,3,2.8,2.8], // objective 3
  ],
  lowerBounds: [
    [0,0.2, 0.3, 0.5,1.5,1.5], // objective 1
    [0.0,0.05, 0.1, 0.15, 0.2, 0.2], // objective 2
    [-5,-4, -3,0.2,0.5,0.5], // objective 3
  ],
  referencePoints: [
    [7, 6, 4, 4, 3,3], // objective 1
    [1.5,1.2,0.45, 0.45,0.42, 0.4],  // objective 2
    [-1,-1,1,1,2, 2 ], // objective 3 
  ],
  // boundary needs to have set default value or some value for the objective if its not used so the order doenst go wrong
  boundaries: [
    [8,8,8,6,6, 6], 
    [Number.NaN],
    //[0.7, 0.7,0.7,0.7,0.7,0.7,1, 1, 1, 1],
    [-2, -2,-2,0, 0 , 0 ]
  ],
  totalSteps: 100,
  stepsTaken: 5, // this must to be stepsTaken - 1 from to the bounds and refereslines given. 
}


export const exampleProblem5ObjectiveData: ProblemInfo = {
  problemId: 1,
  problemName: "TestProblem",
  problemType: "Discrete",
  objectiveNames: ["G1", "G2", "G3", "G4", "G5"],
  variableNames: ["X", "Y", "Z", "R", "V"],
  nObjectives: 5,
  ideal: [0,0, 5, 10, 2],
  nadir: [10, 2, -5, 0, 0],
  minimize: [1,1,-1, -1, -1],
}

export const exampleSingle5OldAlternative: ObjectiveData = {
  values: [
    {
      selected: false,
      value: [50, 0.15, -400, 20000, 150],
    },
  ],
  names: ["Price", "Quality", "Time", "Efficiency", "???"],
  directions: [1, -1, 1, -1, -1],
  ideal: [25, 0.95, -871, 150000, 300],
  nadir: [101, 0.11, 801, 520, 100],
};

export const exampleDataSingle5Objectives: ObjectiveData = {
  values: [
    {
      selected: false,
      value: [40, 0.2, -500, 25000, 200],
    },
  ],
  names: ["Price", "Quality", "Time", "Efficiency", "???"],
  directions: [1, -1, 1, -1, -1],
  ideal: [25, 0.95, -871, 150000, 300],
  nadir: [101, 0.11, 801, 520, 100],
};

export const exampleDataSingle3Objectives: ObjectiveData = {
  values: [
    {
      selected: false,
      value: [50, 0.2, -500],
    },
  ],
  names: ["Price", "Quality", "Time"],
  directions: [1, -1, 1],
  ideal: [25, 0.95, -871],
  nadir: [101, 0.11, 801],
};

export const exampleDataSimple3Objectives: ObjectiveData = {
  values: [
    {
      selected: false,
      value: [45, 0.2, 100],
    },
    {
      selected: false,
      value: [75, 0.4, 80],
    },
    {
      selected: false,
      value: [101, 0.6, 40],
    },
  ],
  names: ["Price", "Quality", "Time"],
  directions: [1, -1, 1],
  ideal: [25, 0.95, 150],
  nadir: [101, 0.11, 1],
};

export const exampleDataTen4Objectives: ObjectiveData = {
  names: ["Price", "Quality", "Time", "Efficiency"],
  directions: [1, -1, 1, -1],
  ideal: [25, 0.95, -871, 10],
  nadir: [101, 0.11, 801, 0],
  values: [
    {
      selected: true,
      value: [50, 0.2, -500, 1],
    },
    {
      selected: false,
      value: [28, 0.9, -300, 2],
    },
    {
      selected: false,
      value: [90, 0.13, -800, 3],
    },
    {
      selected: false,
      value: [40, 0.3, 500, 4],
    },
    {
      selected: false,
      value: [55, 0.6, -550, 5],
    },
    {
      selected: false,
      value: [66, 0.22, 602, 6],
    },
    {
      selected: false,
      value: [26, 0.18, 100, 7],
    },
    {
      selected: false,
      value: [99, 0.33, 0, 8],
    },
    {
      selected: false,
      value: [80, 0.73, -100, 9],
    },
    {
      selected: false,
      value: [33.3, 0.81, -150, 10],
    },
  ],
};

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
  