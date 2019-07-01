//
//  StudentService.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya
import Alamofire

enum StudentService {
    
    /// Requests and shows the Student of the given User ID number
    case showStudent(id: Int)
    
    /// Requests and shows all available Students
    case showStudents
    
    /// Searches for Students matching the given search terms
    ///
    /// - Parameters:
    ///   - searchTerms: A Parameters dictionary supplying search terms. Currently, valid options include:
    ///     - search: A String to search for in the students
    ///     - ordering: The ordering to be done, specified by a string of the element to search by
    case searchForStudents(params: Parameters)
    
    /// Updates a Student that currently exists in the database.
    ///
    /// - Parameters:
    ///   - id: The User ID number of the Student to be updated
    ///   - params: A Paramaters dictionary defining the values to replace in the Student.
    case updateStudent(id: Int, params: Parameters)
    
    /// Deletes a Student from the database.
    ///
    /// - Parameters:
    ///   - id: The User ID number of the Student to be deleted
    case deleteStudent(id: Int)
    
}

extension StudentService: TargetType {
    
    var baseURL: URL { return URL(string: "http://localhost:8000/api/v1/students/")! }
    
    var path: String {
        switch self {
        case .showStudent(let id), .updateStudent(let id, _), .deleteStudent(let id):
            return "\(id)/"
        default:
            return ""
        }
    }
    
    var method: Moya.Method {
        switch self {
        case .showStudent, .showStudents, .searchForStudents:
            return .get
        case .updateStudent:
            return .put
        case .deleteStudent:
            return .delete
        }
    }
    
    var task: Task {
        switch self {
        case .showStudent, .showStudents, .deleteStudent:
            return .requestPlain
        case .searchForStudents(let params):
            return .requestParameters(parameters: params, encoding: URLEncoding.queryString)
        case .updateStudent(_, let params):
            return .requestParameters(parameters: params, encoding: JSONEncoding.default)
        }
    }
    
    var sampleData: Data {
        let sampleUser = User(id: 1, username: "hollarbl", fullName: "Ben Hollar", email: "hollarbl@mail.uc.edu", isStudent: true)
        let sampleStudent = [Student(mNumber: "M10305078", user: sampleUser)]
        let sampleStudentData = try! JSONEncoder().encode(sampleStudent)
        
        switch self {
        case .showStudent(let id):
            // TODO: The else case probably doesn't return an empty Data object
            if id == 1 { return sampleStudentData } else { return Data() }
        case .showStudents:
            return sampleStudentData
        default:
            // TODO: I'm not sure what the other cases return
            return Data()
        }
    }
    
    var headers: [String: String]? {
        return ["Content-type": "application/json"]
    }
    
}
