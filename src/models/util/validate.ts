import {commonCriterias, validationCriterias, actionRequiredFields} from './validationInfo';
import * as express from 'express';

export class Validation{
    static validate(req:any, res:express.Response, next:express.NextFunction){
        let action:string = req.originalUrl.split('/')[2];
        let result:any = Validation.validateData(req.body, actionRequiredFields[action]);
        
        if(result.status){
            req.validData = result.data.validData;
            next();
        } else{
            res.status(400).json(result);
        }
    }

    static validateReal(action:string, data:any){
        return Validation.validateData(data, actionRequiredFields[action]);
    }

    static validateField(field:string, reqFieldAlias:string, data:any, validationCriteria:any=validationCriterias){
        for(let rule in validationCriteria[reqFieldAlias]){
            if(!Validation.validators(data[field], rule, validationCriteria[reqFieldAlias][rule])){
                return false;
            }    
        }
        return true;
    }

    static validateData(data:any, requiredFields:any, validationCriteria:any=validationCriterias){
        let validData:any = null;
        let missingFields:any = {};
        let invalidFields:any = {};

        for(let field of requiredFields.fields){
            let reqFieldAlias = field;

            if(requiredFields.alias && requiredFields.alias.hasOwnProperty(field)){
                reqFieldAlias = requiredFields.alias[field];
            }

            if(data.hasOwnProperty(field)){
                if(typeof(data[field]) == 'object'){
                    for(let i=0;i<data[field].length;i++){
                        if(typeof(data[field][i]) == 'string'){
                            data[field][i] = data[field][i].trim();
                        }

                        for(let rule in validationCriteria[reqFieldAlias]){
                            if(!Validation.validators(data[field][i], rule, validationCriteria[reqFieldAlias][rule])){
                                invalidFields[field] = false;
                                break;
                            }    
                        }
                    }
                } else{
                    if(typeof(data[field]) == 'string'){
                        data[field] = data[field].trim();
                    }

                    if(!Validation.validateField(field, reqFieldAlias, data)){
                        invalidFields[field] = false;
                    }
                }   
            } else{
                missingFields[field] = false;
            }            
        }

        let status = false;
        if(Object.keys(invalidFields).length == 0 && Object.keys(missingFields).length == 0){
            status = true;
            validData = data;
            if(Object.keys(data).length > requiredFields.fields.length){
                validData = {};
                for(let field of requiredFields.fields){
                    validData[field] = data[field];
                }
            }
            invalidFields = null;
        }

        if(Object.keys(missingFields).length==0){
            missingFields = null;
        }

        return {status:status, data:{validData:validData, invalidFields:invalidFields, missingFields:missingFields}}
    }

    static validators(inputValue:any, rule:any, argument?:any):Boolean{
        switch(rule){
            case 'string':{
                return typeof(inputValue) == 'string';
            }
            case 'boolean':{
                return typeof(inputValue) == 'boolean';
            }
            case 'required':{
                if(typeof(inputValue) == 'string'){
                    return inputValue != null && inputValue != '';    
                }
                return inputValue != null;
            }
            case 'onlyTxt':{
                return !inputValue.search(/\W|\d|\0/);
            }
            case 'ns':{
                return !inputValue.search(/\s/);
            }
            case 'number':{
                return typeof(inputValue) == 'number';
            }
            case 'int':{
                return typeof(inputValue) == 'number' && Math.ceil(inputValue) - Math.floor(inputValue) == 0;
            }
            case 'date':{
                return false;
            }
            case'dateCustom':{
                return false;
            }
            case 'dateInt':{
                return false;
            }
            case 'listval':{
                return argument.indexOf(inputValue.toLowerCase()) != -1;
            }
            case 'pattern':{
                let pattern = argument;
                return pattern.test(inputValue);
            }
            case 'email':{
                let pattern = /[\d|\w]+@[\w|\d]+.[\w|\d]+/;
                return pattern.test(inputValue) && inputValue.search(/\s/) == -1;
            }
            case 'maxLen':{
                return typeof(inputValue) == 'string' && inputValue.length <= argument;
            }
            case 'minLen':{
                return typeof(inputValue) == 'string' && inputValue.length >= argument;
            }
            case 'maxVal':{
                return typeof(inputValue) == 'number' && inputValue <= argument;
            }
            case 'minVal':{
                return typeof(inputValue) == 'number' && inputValue >= argument;
            }
            case 'positive':{
                return typeof(inputValue) == 'number' && inputValue > 0;
            }
            default:{
                return false;
            }
        }

    }

    private static composeErrorMsg(fieldName:any, arg?:any){
        switch(fieldName){
            case 'required':{
                return `${fieldName} must have a value`;
            }
            case 'onlyTxt':{
                return `${fieldName} accepts only letters`;
            }
            case 'number':{
                return `${fieldName} accepts only numbers`;
            }
            case 'int':{
                return `${fieldName} accepts only integers`;
            }
            case 'date':{
                return `${fieldName} accepts only letters`;
            }
            case'dateCustom':{
                return `${fieldName} accepts only letters`;
            }
            case 'dateInt':{
                return `${fieldName} must be in the range ${arg.minDate} to ${arg.maxDate}`;
            }
            case 'listval':{
                return `Value of ${fieldName} must be in list of allowed values`;
            }
            case 'pattern':{
                return `${fieldName} must be of the form ${arg.samplePattern}`;
            }
            case 'email':{
                return `${fieldName} isn't a valid email`;
            }
            case 'maxLen':{
                return `Maximum length of ${fieldName} exceeded`;
            }
            case 'minLen':{
                return `${fieldName} must have a minimum of ${arg.minLen} charcaters`;
            }
            case 'maxVal':{
                return `${fieldName} must be less or equal to ${arg.maxVal}`;
            }
            case 'minVal':{
                return `${fieldName} must be greater or equal to ${arg.minVal}`;
            }
        }
    }

    private static validateDate(date:any){

    }

    private static validateDateInterval(date:any, minDate:any, maxDate:any){

    }
}