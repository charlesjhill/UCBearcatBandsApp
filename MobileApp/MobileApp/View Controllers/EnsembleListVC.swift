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
                for i in ensembles! { content.appred(EnsembleListVC(i))}
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
    
    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at index: Int) -> ListSelectionResponse {
        selectedEnsemble = ensembles![index]
        performSegue(withIdentifier: "toEnsembleDetails", sender: nil)
        return [.deselect]
    }
}

