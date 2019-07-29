//
//  StudentAssignVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/29/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class StudentAssignVC: UIViewController {
    
    var students: [Student]? = nil {
        didSet { updateInfo() }
    }
    var ensemble: Ensemble? = nil
    var ensembleEnrollments: [Enrollment]? = nil
    let provider = MoyaProvider<EnrollmentService>()
    
    @IBOutlet weak var ListView: UIView!
    let ListViewContainer = ContainerViewController(content: nil)
    let StudentList = ListViewController()
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        StudentList.listDelegate = self
        refreshStudents()
    }
    
    private func refreshStudents() {
        let p = MoyaProvider<StudentService>()
        p.request(.showStudents) { result in
            switch result {
            case let .success(moyaResponse):
                self.students = moyaResponse.parseJsonResponse()
            case let .failure(error):
                print(error)
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        embedChild(ListViewContainer, in: ListView)
        ListViewContainer.content = StudentList
    }
    
    private func updateInfo() {
        guard students != nil else { return }
        guard ensembleEnrollments != nil else { return }
        let assignedStudents = ensembleEnrollments!.allStudents()
        let assignedIds = assignedStudents.map { $0.mNumber }
        
        var studentListContent: Array<AssignedStudentCellVC> = []
        for s in students! {
            let vc = AssignedStudentCellVC(student: s)
            if assignedIds.contains(s.mNumber) { vc.switchVisibility = false }
            studentListContent.append(vc)
        }
        StudentList.content = studentListContent
    }
    
    @IBAction func enrollPressed(_ sender: Any) {
        guard ensemble != nil else { return }
        let content = StudentList.content as! Array<AssignedStudentCellVC>
        let assignedStudents = content.getAssignedStudents()
        for s in assignedStudents {
            provider.request(.addEnrollment(ensembleId: ensemble!.id, studentId: s.user.id)) { result in }
        }
    }
    
}

extension StudentAssignVC: ListViewControllerDelegate {
    
    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at indexPath: IndexPath) -> ListSelectionResponse {
        return [.deselect]
    }
    
    func listViewController(_ list: ListViewController, swipeConfigurationFor item: UIViewController, at indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return nil
    }
    
    func listViewController(_ list: ListViewController, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        return
    }
    
    func refreshContents(of list: ListViewController) {
        refreshStudents()
    }
    
}
