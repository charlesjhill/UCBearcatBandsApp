//
//  StudentVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Alamofire

class StudentVC: UIViewController {
    
    var dataAccessor: StudentDataAccessing = StudentDataAccessor()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        // DEBUG: Purely for debugging, just call the functions here. We _should_ just do this via the interface
        // triggering the functions
        dataAccessor.loadAllStudents() { result in
            guard let students = result else { return }
            for s in students { print(s) }
        }
        
        dataAccessor.addStudent(firstName: "Test", lastName: "Student", mNumber: "M12345678")
        
        let searchTerms: Parameters = ["search": "test",
                                       "ordering": "first_name"]
        dataAccessor.searchForStudents(searchTerms: searchTerms) { result in
            guard let students = result else { return }
            for s in students { self.dataAccessor.deleteStudent(student: s) }
        }
        // END DEBUG
    }

}

