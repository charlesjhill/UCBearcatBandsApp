//
//  UniformListVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/23/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class UniformListVC: UIViewController {
    
    let provider = MoyaProvider<UniformService>()
    var uniforms: [UniformPiece]? = nil {
        didSet {
            var content: Array<UniformCellVC> = []
            if uniforms != nil {
                for u in uniforms! { content.append(UniformCellVC(u)) }
            }
            UniformList.content = content
        }
    }
    var selectedUniform: UniformPiece? = nil
    
    @IBOutlet weak var ListView: UIView!
    let ListViewContainer = ContainerViewController(content: nil)
    let UniformList = ListViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        embedChild(ListViewContainer, in: ListView)
        ListViewContainer.content = UniformList
        UniformList.listDelegate = self
    }
    
    override func viewDidAppear(_ animated: Bool) {
        provider.request(.showUniforms) { result in
            switch result {
            case let .success(moyaResponse):
                self.uniforms = moyaResponse.parseJsonResponse(response: moyaResponse)
            case let .failure(error):
                print(error)
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier {
        case "toUniformDetails":
            let vc = segue.destination as! UniformDetailsVC
            vc.uniform = selectedUniform
        default:
            break
        }
    }
    
}

extension UniformListVC: ListViewControllerDelegate {
    
    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at indexPath: IndexPath) -> ListSelectionResponse {
        selectedUniform = uniforms![indexPath.row]
        performSegue(withIdentifier: "toUniformDetails", sender: nil)
        return [.deselect]
    }
    
    func listViewController(_ list: ListViewController, swipeConfigurationFor item: UIViewController, at indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        return nil
    }
    
    func listViewController(_ list: ListViewController, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        let uniformToEdit = uniforms![indexPath.row]
        if (editingStyle == .delete) {
            // We'll double check with the user that they actually want to delete things
            let refreshAlert = UIAlertController(title: "Are you sure?",
                                                 message: "You will not be able to recover \(uniformToEdit.name).",
                                                 preferredStyle: UIAlertController.Style.alert)
            
            refreshAlert.addAction(UIAlertAction(title: "Delete", style: .default, handler: { (action: UIAlertAction!) in
                // Actually perform the deletion
                self.provider.request(.deleteUniform(id: uniformToEdit.id)) { result in
                    switch result {
                    case let .success(moyaResponse):
                        if moyaResponse.statusCode == 204 {
                            self.uniforms!.remove(at: indexPath.row)
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
