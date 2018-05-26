
import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Project } from './../app/projects/model/project'


@Injectable()
export class ProjectServiceMock{
    public projectMock: Project = {
        name: 'Test Project',
        keys: [],
        id: 'test-project'
    }
    createProject( project ){
        project = this.projectMock;
        return observableOf(project);
    }

    fail(){
        throw new Error('no project in res');
    }
}