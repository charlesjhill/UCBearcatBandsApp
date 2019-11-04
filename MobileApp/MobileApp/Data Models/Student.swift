//
//  Student.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

/// The model for a Student user
struct Student {
    
    /// The UC identification number - the "M Number" - of the Student
    ///
    /// - Note:
    ///   The letter "M" must prepend the remainder of the String, and there must be 8 digits following it.
    let mNumber: String
    
    /// The underlying User model of the Student, because you know, Students *are* Users
    let user: User
    
}

extension Student: Codable {
    
    enum CodingKeys: String, CodingKey {
        case user
        case mNumber = "m_number"
    }
    
}


