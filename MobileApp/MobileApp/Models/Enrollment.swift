//
//  Enrollment.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/26/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import Foundation

struct Enrollment: DjangoModel {
    
    let id: Int
    
    let ensemble: Int
    
    let student: Student
    
    let assets: [GenericAsset]
    
}


extension Enrollment: Codable {
    
    enum CodingKeys: String, CodingKey {
        case id, ensemble, student, assets
    }
    
}

extension Array where Element == Enrollment {
    
    func allStudents() -> [Student] {
        if self.count == 0 { return [] }
        var students = Array<Student>()
        for enrollment in self { students.append(enrollment.student) }
        return students
    }
    
}
