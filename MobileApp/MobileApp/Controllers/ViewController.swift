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
    
    // MARK: - Properties
    
    // TODO: We should replace this with a deployed URL once we have it
    let studentsUrl = "http://localhost:8000/students/"
    
    var filteredStudents: [Student]? {
        didSet {
            // TODO: Update a view here?
           
            // DEBUG
            guard let students = self.filteredStudents else { return }
            // for s in students { print(s) }
            for s in students { deleteStudent(student: s) }
            // let demoStudent = Student(id: nil, firstName: "Student", lastName: "Test", mNumber: "M87654321")
            // for s in students { editStudent(student: s, params: demoStudent.toDictionary()!)}
            // END DEBUG
        }
    }
    
    var loadedStudents: [Student]? {
        didSet {
            // TODO: Update a view here?
            
            // DEBUG
            guard let students = self.loadedStudents else { return }
            for s in students { print(s) }
            // END DEBUG
        }
    }
    
    // MARK: - Methods

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        // DEBUG: Purely for debugging, just call the functions here. We _should_ just do this via the interface
        // triggering the functions
        loadAllStudents()
        addStudent(firstName: "Test", lastName: "Student", mNumber: "M12345678")
        searchForStudents(searchTerms: ["search": "test",
                                        "ordering": "first_name"])
        // END DEBUG
    }
    
    /// Searches for students matching the given search terms
    ///
    /// - Parameters:
    ///   - searchTerms: A Parameters dictionary supplying search terms. Currently, valid options include:
    ///     - search: A String to search for in the students
    ///     - ordering: The ordering to be done, specified by a string of the element to search by
    func searchForStudents(searchTerms: Parameters) {
        // Get the formatted query URL
        guard let searchUrl = URL.makeUrlWithTerms(baseUrl: studentsUrl, terms: searchTerms) else {
            filteredStudents = nil
            return
        }
        // Make the request
        Alamofire.request(searchUrl).responseJSON { response in
            self.filteredStudents = self.parseReponseJson(response: response)
        }
    }

    /// Requests and loads all available students
    func loadAllStudents() {
        Alamofire.request(studentsUrl).responseJSON { response in
            self.loadedStudents = self.parseReponseJson(response: response)
        }
    }

    /// Adds a Student to the database
    ///
    /// - Parameters:
    ///   - student: The Student to be added
    func addStudent(student: Student) {
        guard let params = student.toDictionary() else { return }
        Alamofire.request(studentsUrl, method: .post, parameters: params, encoding: JSONEncoding.default)
    }

    /// Adds a Student to the database
    ///
    /// - Parameters:
    ///   - firstName: The first name of the Student
    ///   - lastName: The last name of the Student
    ///   - mNumber: The UC identification number of the student, beginning with an M
    func addStudent(firstName: String, lastName: String, mNumber: String) {
        let student = Student(id: nil, firstName: firstName, lastName: lastName, mNumber: mNumber)
        addStudent(student: student)
    }
    
    /// Edits a student that currently exists in the database.
    ///
    /// - Parameters:
    ///   - student: The Student to be modified; must include a valid (non-nil) ID
    ///   - params: A Paramaters dictionary defining the values to replace in the student. Can be obtained via
    ///     Student.toDictionary()
    func editStudent(student: Student, params: Parameters) {
        guard let id = student.id else { return }
        Alamofire.request("\(studentsUrl)\(id)/", method: .put, parameters: params, encoding: JSONEncoding.default)
    }
    
    /// Deletes a student from the database.
    ///
    /// - Parameters:
    ///   - student: The Student to be deleted; must include a valid (non-nil) ID
    func deleteStudent(student: Student) {
        guard let id = student.id else { return }
        Alamofire.request("\(studentsUrl)\(id)/", method: .delete)
    }
    
    /// Handle and parse the response of an Alamofire .request() which may return students.
    ///
    /// - Parameters:
    ///   - response: An Alamofire DataResponse of any type to be handled. The payload data, if available, should be
    ///     JSON encoded Students.
    /// - Returns:
    ///   - An Optional array of Students; if the request was unsuccessful, returns nil
    private func parseReponseJson(response: DataResponse<Any>) -> [Student]? {
        guard response.result.isSuccess else {
            print("Response: \(String(describing: response.response))")
            return nil
        }
        guard let data = response.data else { return nil }
        
        // We got here, so we have data. Decode it into our Student struct or complain about an error
        var result: [Student]? = nil
        do {
            result = try JSONDecoder().decode(Array<Student>.self, from: data)
        } catch {
            print("JSON error: \(error)")
        }
        return result ?? nil
    }

}

