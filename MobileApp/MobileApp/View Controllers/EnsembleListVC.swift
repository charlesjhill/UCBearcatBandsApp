//
//  EnsembleListVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/24/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class EnsembleListVC: UIViewController {
    
    let provider = MoyaProvider<EnsembleService>()
    var ensembles: [Ensemble]? = nil {
        didSet {
            var content: Array<EnsembleCellVC> = []
            if ensembles != nil {
                for i in ensembles! { content.append(EnsembleCellVC(i))}
            }
            EnsembleList.content = content
        }
    }
    var selectedEnsemble: Ensemble? = nil
    
    @IBOutlet weak var ListView: UIView!
    let ListViewContainer = ContainerViewController(content: nil)
    let EnsembleList = ListViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        embedChild(ListViewContainer, in: ListView)
        ListViewContainer.content = EnsembleList
        EnsembleList.listDelegate = self
        
    }
    
    override func viewDidAppear(_ animated: Bool) {
        provider.request(.showEnsembles) { result in
            switch result {
            case let .success(moyaResponse):
                self.ensembles = moyaResponse.parseJsonResponse(response: moyaResponse)
            case let .failure(error):
                print(error)
            }
        }
    }
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier{
        case "toEnsembleDetails":
            let vc = segue.destination as! EnsembleDetailsVC
            vc.ensemble = selectedEnsemble
        default:
            break
        }
    }
    
}

extension EnsembleListVC: ListViewControllerDelegate {

    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at indexPath: IndexPath) -> ListSelectionResponse {
        selectedEnsemble = ensembles![indexPath.row]
        performSegue(withIdentifier: "toEnsembleDetails", sender: nil)
        return [.deselect]
    }
    
    func listViewController(_ list: ListViewController, swipeConfigurationFor item: UIViewController, at indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return nil
    }
    
    func listViewController(_ list: ListViewController, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        let ensembleToEdit = ensembles![indexPath.row]
        if (editingStyle == .delete) {
            // We'll double check with the user that they actually want to delete things
            let refreshAlert = UIAlertController(title: "Are you sure?",
                                                 message: "You will not be able to recover \(ensembleToEdit.name).",
                preferredStyle: UIAlertController.Style.alert)
            
            refreshAlert.addAction(UIAlertAction(title: "Delete", style: .default, handler: { (action: UIAlertAction!) in
                // Actually perform the deletion
                self.provider.request(.deleteEnsemble(id: ensembleToEdit.id)) { result in
                    switch result {
                    case let .success(moyaResponse):
                        if moyaResponse.statusCode == 204 {
                            self.ensembles!.remove(at: indexPath.row)
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
    
}

