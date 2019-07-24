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
    
    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at index: Int) -> ListSelectionResponse {
        selectedUniform = uniforms![index]
        performSegue(withIdentifier: "toUniformDetails", sender: nil)
        return [.deselect]
    }
    
    //    func listViewController(_ list: ListViewController, swipeConfigurationFor item: UIViewController) -> UISwipeActionsConfiguration? {
    //        return nil
    //    }
    
}
