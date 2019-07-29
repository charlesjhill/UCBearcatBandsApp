//
//  EnsembleDetailsVC.swift
//  MobileApp
//
//  Created by Stephanie Tam on 7/26/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class EnsembleDetailsVC: UIViewController {
    
    var ensemble: Ensemble? = nil {
        didSet { updateInfo() }
    }
    
    private var endpointRequest: String = ""
    private var provider = MoyaProvider<EnsembleService>()
    private var enrolledStudentList = ListViewController()
    
    @IBOutlet weak var nameField: UITextField!
    @IBOutlet weak var termField: UITextField!
    @IBOutlet weak var studentListView: UIView!
    @IBOutlet var requestButton: UIButton!
    
    override func viewDidLoad() {
        endpointRequest = ensemble == nil ? "Create" : "Update"
        enrolledStudentList.listDelegate = self
        embedChild(enrolledStudentList, in: studentListView)
        updateInfo()
    }
    
    private func updateInfo() {
        requestButton?.setTitle(endpointRequest, for: .normal)
        guard let e = ensemble else { return }
        nameField?.text = e.name
        termField?.text = e.term
        
        var studentItems: Array<AssignedStudentCellVC> = []
        for s in e.enrollments.allStudents() {
            let vc = AssignedStudentCellVC(student: s)
            vc.switchVisibility = false
            studentItems.append(vc)
        }
        enrolledStudentList.content = studentItems
    }
    
    private func constructEnsemble() -> Ensemble? {
        // TODO: Definitely going to need better handling of optional strings here
        var id = 1
        if ensemble != nil { id = ensemble!.id }
        return Ensemble(id: id,
                        name: nameField!.text!,
                        term: termField!.text!,
                        isActive: true,
                        enrollments: [])
    }
    
    private func sendRequest() {
        guard let e = constructEnsemble() else { return }
        switch endpointRequest.lowercased() {
        case "create":
            provider.request(.addEnsemble(e)) { result in }
        case "update":
            provider.request(.updateEnsemble(id: e.id, ensemble: e)) { result in }
        default:
            break
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier {
        case "toAssignStudent":
            let vc = segue.destination as! StudentAssignVC
            vc.ensemble = ensemble
            vc.ensembleEnrollments = ensemble?.enrollments
        default:
            break
        }
    }
    
    @IBAction func assignStudentPressed(_ sender: Any) {
        // TODO: Implement
        performSegue(withIdentifier: "toAssignStudent", sender: nil)
    }
    
    @IBAction func requestButtonPressed(_ sender: Any) {
        sendRequest()
    }
    
}

extension EnsembleDetailsVC: ListViewControllerDelegate {
    
    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at indexPath: IndexPath) -> ListSelectionResponse {
        return [.deselect]
    }
    
    func listViewController(_ list: ListViewController, swipeConfigurationFor item: UIViewController, at indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return nil
    }
    
    func listViewController(_ list: ListViewController, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        let enrollmentToEdit = ensemble!.enrollments[indexPath.row]
        if (editingStyle == .delete) {
            // We'll double check with the user that they actually want to delete things
            let refreshAlert = UIAlertController(title: "Are you sure?",
                                                 message: "You will not be able to undo this action.",
                preferredStyle: UIAlertController.Style.alert)
            
            refreshAlert.addAction(UIAlertAction(title: "Unenroll", style: .default, handler: { (action: UIAlertAction!) in
                // Actually perform the deletion
                let p = MoyaProvider<EnrollmentService>()
                p.request(.deleteEnrollment(id: enrollmentToEdit.id)) { result in
                    switch result {
                    case let .success(moyaResponse):
                        if moyaResponse.statusCode == 204 {
                            self.updateInfo()
                        }
                    case let .failure(error):
                        print(error)
                    }
                }
            }))
            refreshAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
            present(refreshAlert, animated: true, completion: nil)
        }
    }
    
    func refreshContents(of list: ListViewController) {
        guard let e = ensemble else { return }
        provider.request(.showEnsemble(id: e.id)) { result in
            switch result {
            case let .success(moyaResponse):
                self.ensemble = moyaResponse.parseJsonResponse()
            case let .failure(error):
                print(error)
            }
        }
    }
    
}
