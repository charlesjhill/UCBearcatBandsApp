//
//  EnrollmentService.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/29/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya

enum EnrollmentService {
    
    case addEnrollment(ensembleId: Int, studentId: Int)
    
    case deleteEnrollment(id: Int)
    
}

extension EnrollmentService: TargetType {
    var baseURL: URL { return URL(string: "http://localhost:8000/api/v1/enrollments/")!}
    
    var path: String {
        switch self {
        case .deleteEnrollment(let id): return "\(id)/"
        default:
            return ""
        }
    }
    
    var method: Moya.Method {
        switch self {
        case .addEnrollment:
            return .post
        case .deleteEnrollment:
            return .delete
            
        }
    }
    
    var sampleData: Data {
        // TODO: sample data
        return Data()
    }
    
    var task: Task {
        switch self{
        case .deleteEnrollment:
            return .requestPlain
        case .addEnrollment(let ensembleId, let studentId):
            return .requestParameters(parameters: ["ensemble": ensembleId,
                                                   "student": studentId],
                                      encoding: JSONEncoding.default)
        }
    }
    
    var headers: [String : String]? {
        return ["Content-type": "application/json"]
    }
    
    
}
