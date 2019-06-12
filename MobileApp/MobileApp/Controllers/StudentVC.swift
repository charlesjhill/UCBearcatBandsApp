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

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        // DEBUG: Purely for debugging, just call the functions here. We _should_ just do this via the interface
        // triggering the functions
        loadAllStudents() { result in
            guard let students = result else { return }
            for s in students { print(s) }
        }
        
        addStudent(firstName: "Test", lastName: "Student", mNumber: "M12345678")
        
        let searchTerms: Parameters = ["search": "test",
                                       "ordering": "first_name"]
        searchForStudents(searchTerms: searchTerms) { result in
            guard let students = result else { return }
            for s in students { self.deleteStudent(student: s) }
        }
        // END DEBUG
    }

}

extension StudentVC: StudentDataAccessing {
    
    /// The URL to access when speaking with the backend API
    /// - TODO:
    ///   - We should replace this with a deployed URL once we have it
    private var studentsUrl: String {
        get { return "http://localhost:8000/students/" }
    }

    func searchForStudents(searchTerms: Parameters, completion: StudentsRetrieved = nil) {
        // Get the formatted query URL
        guard let searchUrl = URL.makeUrlWithTerms(baseUrl: studentsUrl, terms: searchTerms) else {
            completion?(nil)
            return
        }
        // Make the request
        Alamofire.request(searchUrl).responseJSON { response in
            completion?(self.parseReponseJson(response: response))
        }
    }
    
    func loadAllStudents(completion: StudentsRetrieved = nil) {
        Alamofire.request(studentsUrl).responseJSON { response in
            completion?(self.parseReponseJson(response: response))
        }
    }
    
    func addStudent(student: Student) {
        guard let params = student.toDictionary() else { return }
        Alamofire.request(studentsUrl, method: .post, parameters: params, encoding: JSONEncoding.default)
    }
    
    func addStudent(firstName: String, lastName: String, mNumber: String) {
        let student = Student(id: nil, firstName: firstName, lastName: lastName, mNumber: mNumber)
        addStudent(student: student)
    }
    
    func editStudent(student: Student, params: Parameters) {
        guard let id = student.id else { return }
        Alamofire.request("\(studentsUrl)\(id)/", method: .put, parameters: params, encoding: JSONEncoding.default)
    }

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

