//
//  StudentVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class StudentVC: UIViewController {

    /// The API service provider
    var provider: MoyaProvider = MoyaProvider<StudentService>()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        // DEBUG: Purely for debugging, just call the functions here. We _should_ just do this via the interface
        // triggering the functions
//        provider.request(.showStudents, completion: debugCompletion)
//        provider.request(.showStudent(id: 1), completion: debugCompletion)
//        provider.request(.searchForStudents(params: ["search": "M12345678"]), completion: debugCompletion)
        let s = Student(mNumber: "M10305078",
                        user: User(id: 1, fullName: "Ben Hollar", email: "hollarbl@mail.uc.edu", isStudent: true))
        provider.request(.updateStudent(id: 1, student: s), completion: debugCompletion)
        
//        let db = SampleDatabasePopulation()
//        db.populate()
        // END DEBUG
    }
    
    // TODO: Replace this with per-request completion handlers, possibly a unified helper to parse JSON
    lazy var debugCompletion: Completion = { result in
        switch result {
        case let .success(moyaResponse):
            let data = moyaResponse.data
            print(moyaResponse.statusCode)
            var maybeStudents: [Student]? = nil
            do {
                maybeStudents = try JSONDecoder().decode(Array<Student>.self, from: data)
            } catch {
                // Did we only get a single item instead of an Array?
                do {
                    maybeStudents = try [JSONDecoder().decode(Student.self, from: data)]
                } catch {
                    print("JSON erorr: \(error)")
                }
            }
            guard let students = maybeStudents else { return }
            for s in students { print(s) }
        case let .failure(error):
            print(error)
        }
        print("")
    }

}

