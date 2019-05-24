//
//  ViewController.swift
//  MobileApp
//
//  Created by Ben Hollar on 5/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Alamofire

class ViewController: UIViewController {

    // TODO: We should replace this with a deployed URL once we have it
    let studentsUrl = "http://localhost:8000/students/"

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        // DEBUG: Purely for debugging, just call the functions here. We _should_ just do this via the interface
        // triggering the functions
        requestAllStudents()
        addStudent(firstName: "Test", lastName: "Student", mNumber: "M12345678")
    }

    func requestAllStudents() {
        Alamofire.request(studentsUrl).responseJSON { response in
            guard response.result.isSuccess else {
                print("Response: \(String(describing: response.response))")
                return
            }
            guard let data = response.data else { return }

            // We got here, so we have data. Decode it into our Student struct or complain about an error
            var result: [Student]? = nil
            do {
                result = try JSONDecoder().decode(Array<Student>.self, from: data)
            } catch {
                print("JSON error: \(error)")
            }
            guard let students = result else { return }

            // TODO: Ideally we'd replace this line and populate a view with the information
            for s in students { print(s) }
        }
    }

    func addStudent(student: Student) {
        guard let params = student.toDictionary() else { return }
        Alamofire.request(studentsUrl, method: .post, parameters: params, encoding: JSONEncoding.default)
    }

    func addStudent(firstName: String, lastName: String, mNumber: String) {
        let student = Student(firstName: firstName, lastName: lastName, mNumber: mNumber)
        addStudent(student: student)
    }

}

