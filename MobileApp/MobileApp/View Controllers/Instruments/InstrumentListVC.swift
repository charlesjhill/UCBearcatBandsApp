//
//  InstrumentListVC.swift
//  MobileApp
//
//  Created by Ben Hollar on 7/23/19.
//  Copyright © 2019 UCBearcatBandsDev. All rights reserved.
//

import UIKit
import Moya

class InstrumentListVC: UIViewController  {
    
    let provider = MoyaProvider<InstrumentService>()
    var instruments: [Instrument]? = nil {
        didSet {
            var content: Array<InstrumentCellVC> = []
            if instruments != nil {
                for i in instruments! { content.append(InstrumentCellVC(i)) }
            }
            InstrumentList.content = content
        }
    }
    var selectedInstrument: Instrument? = nil
    
    @IBOutlet weak var ListView: UIView!
    let ListViewContainer = ContainerViewController(content: nil)
    let InstrumentList = ListViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        embedChild(ListViewContainer, in: ListView)
        ListViewContainer.content = InstrumentList
        InstrumentList.listDelegate = self
    }
    
    override func viewDidAppear(_ animated: Bool) {
        provider.request(.showInstruments) { result in
            switch result {
            case let .success(moyaResponse):
                self.instruments = moyaResponse.parseJsonResponse(response: moyaResponse)
            case let .failure(error):
                print(error)
            }
        }
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier {
        case "toInstrumentDetails":
            let vc = segue.destination as! InstrumentDetailsVC
            vc.instrument = selectedInstrument
        default:
            break
        }
    }
    
}

extension InstrumentListVC: ListViewControllerDelegate {
    
    func listViewController(_ list: ListViewController, didSelect item: UIViewController, at index: Int) -> ListSelectionResponse {
        selectedInstrument = instruments![index]
        performSegue(withIdentifier: "toInstrumentDetails", sender: nil)
        return [.deselect]
    }
    
//    func listViewController(_ list: ListViewController, swipeConfigurationFor item: UIViewController) -> UISwipeActionsConfiguration? {
//        return nil
//    }
    
}
