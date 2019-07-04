//
//  AuthService.swift
//  MobileApp
//
//  Created by Ben Hollar on 6/30/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation
import Moya
import Alamofire

enum AuthService {
    
    /// Log into the API
    ///
    /// - Parameters:
    ///   - email: The User's email
    ///   - password: The password associated with the email
    case login(email: String, password: String)
    
    /// Log out of the API
    case logout
    
    /// Register a student to the API
    ///
    /// - Parameters:
    ///   - email: The email for the new account
    ///   - password: The password to associate with the email
    ///   - fullName: The full name of the new User
    ///   - mNumber: The UC M-Number of the new User
    case registerStudent(email: String, password: String, fullName: String, mNumber: String)
    
}

extension AuthService: TargetType {
    
    var baseURL: URL { return URL(string: "http://localhost:8000/api/v1/rest-auth/")! }
    
    var path: String {
        switch self {
        case .login:
            return "login/"
        case .logout:
            return "logout/"
        case .registerStudent:
            return "registration/"
        }
    }
    
    var method: Moya.Method {
        switch self {
        default:
            return .post
        }
    }
    
    var task: Task {
        switch self {
        case .logout:
            return .requestPlain
        case .login(let email, let password):
            return .requestParameters(parameters: ["username": "",
                                                   "email": email,
                                                   "password": password],
                                      encoding: JSONEncoding.default)
        case .registerStudent(let email, let password, let fullName, let mNumber):
            return .requestParameters(parameters: ["email": email,
                                                   "password1": password,
                                                   "password2": password,
                                                   "full_name": fullName,
                                                   "is_student": true,
                                                   "m_number": mNumber],
                                      encoding: JSONEncoding.default)
        }
    }
    
    var sampleData: Data {
        switch self {
        case .logout:
            return Data() // purposefully empty
        default:
            // TODO: register and login return tokens (how to stub??)
            return Data()
        }
    }
    
    var headers: [String : String]? {
        return ["Content-type": "application/json"]
    }
    
}
