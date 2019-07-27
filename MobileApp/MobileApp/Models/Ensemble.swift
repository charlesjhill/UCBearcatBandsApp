//
//  Ensemble.swift
//  MobileApp
//
//  Created by Stephanie Tam on 7/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct Ensemble: DjangoModel {
    let id: Int
    
    let name: String
    
    let term: String
    
    let isActive: Bool
    
    let members: [Student]?
    
    let enrollments: [Enrollment]?
}

extension Ensemble: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, name, term, members, enrollments
        case isActive = "is_active"
    }
}
